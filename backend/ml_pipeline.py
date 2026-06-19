"""
ATIN ML Pipeline — LightGBM Demand Prediction
Flipkart Gridlock 2.0 | Spatio-Temporal Panel Regression
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import KFold
import lightgbm as lgb
import pickle
import os
import json


def build_features(df):
    """Feature engineering per approach specification."""
    df = df.copy()

    # A. Chronological & Cyclical Time Mapping
    parts = df['timestamp'].astype(str).str.split(':', expand=True).astype(int)
    df['minutes'] = parts[0] * 60 + parts[1]
    df['time_slot'] = df['minutes'] // 15
    df['time_sin'] = np.sin(2 * np.pi * df['minutes'] / 1440)
    df['time_cos'] = np.cos(2 * np.pi * df['minutes'] / 1440)

    # B. Hierarchical Geohash Spatial Deconstruction
    df['geo_prefix_4'] = df['geohash'].str[:4]
    df['geo_prefix_5'] = df['geohash'].str[:5]

    # D. Contextual & Categorical Alignment — preserve missing as level
    for col in ['RoadType', 'Weather', 'Landmarks']:
        df[col] = df[col].fillna('missing')
    df['Temperature'] = df['Temperature'].fillna(df['Temperature'].median())

    cat_cols = ['geohash', 'geo_prefix_4', 'geo_prefix_5',
                'RoadType', 'Weather', 'Landmarks', 'LargeVehicles']
    for col in cat_cols:
        df[col] = df[col].astype('category')

    return df


FEATURE_COLS = [
    'day', 'minutes', 'time_slot', 'time_sin', 'time_cos',
    'NumberofLanes', 'Temperature',
    'geohash', 'geo_prefix_4', 'geo_prefix_5',
    'RoadType', 'Weather', 'Landmarks', 'LargeVehicles',
    'geo_target_enc',
]

CAT_FEATURES = [
    'geohash', 'geo_prefix_4', 'geo_prefix_5',
    'RoadType', 'Weather', 'Landmarks', 'LargeVehicles',
]


def train_model(train_path, test_path, submission_path, output_dir='model'):
    """Train LightGBM with 5-fold CV and OOF target encoding."""
    os.makedirs(output_dir, exist_ok=True)

    train = build_features(pd.read_csv(train_path))
    test = build_features(pd.read_csv(test_path))
    sub = pd.read_csv(submission_path)

    # C. Leakage-Free Spatial Target Encoding (Laplacian smoothing, alpha=10)
    alpha = 10
    global_mean = train['demand'].mean()
    kf = KFold(n_splits=5, shuffle=True, random_state=42)

    train['geo_target_enc'] = global_mean
    test_geo_enc = np.zeros(len(test))

    for _, (tr_idx, va_idx) in enumerate(kf.split(train)):
        stats = train.iloc[tr_idx].groupby('geohash')['demand'].agg(['sum', 'count'])
        enc = (stats['sum'] + alpha * global_mean) / (stats['count'] + alpha)
        train.loc[train.index[va_idx], 'geo_target_enc'] = \
            train.iloc[va_idx]['geohash'].map(enc).fillna(global_mean)
        test_geo_enc += test['geohash'].map(enc).fillna(global_mean).values

    test['geo_target_enc'] = test_geo_enc / 5

    # LightGBM parameters
    params = dict(
        objective='regression', metric='rmse', learning_rate=0.05,
        num_leaves=127, min_child_samples=20, feature_fraction=0.8,
        bagging_fraction=0.8, bagging_freq=5, verbose=-1, n_jobs=-1, seed=42,
    )

    oof = np.zeros(len(train))
    test_preds = np.zeros(len(test))
    cv_scores = []

    for fold, (tr_idx, va_idx) in enumerate(kf.split(train)):
        Xt, yt = train.iloc[tr_idx][FEATURE_COLS], train.iloc[tr_idx]['demand']
        Xv, yv = train.iloc[va_idx][FEATURE_COLS], train.iloc[va_idx]['demand']

        dtrain = lgb.Dataset(Xt, yt, categorical_feature=CAT_FEATURES)
        dval = lgb.Dataset(Xv, yv, categorical_feature=CAT_FEATURES)

        mdl = lgb.train(params, dtrain, 1000, valid_sets=[dval],
                        callbacks=[lgb.early_stopping(50), lgb.log_evaluation(100)])

        oof[va_idx] = mdl.predict(Xv)
        test_preds += mdl.predict(test[FEATURE_COLS]) / 5
        rmse = np.sqrt(np.mean((yv - oof[va_idx]) ** 2))
        cv_scores.append(rmse)
        print(f"  Fold {fold + 1}  RMSE = {rmse:.6f}")

    test_preds = np.clip(test_preds, 0, None)
    overall = np.sqrt(np.mean((train['demand'] - oof) ** 2))
    print(f"\n  Overall CV RMSE = {overall:.6f}")

    # Save artefacts
    sub['demand'] = test_preds
    sub.to_csv(os.path.join(output_dir, 'predictions.csv'), index=False)

    meta = dict(cv_scores=[round(s, 6) for s in cv_scores],
                overall_rmse=round(overall, 6), global_mean=round(global_mean, 6))
    with open(os.path.join(output_dir, 'meta.json'), 'w') as f:
        json.dump(meta, f, indent=2)

    print("  Artefacts saved to", output_dir)
    return meta


if __name__ == '__main__':
    import sys
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.dirname(base)  # "New folder"
    train_model(
        os.path.join(data_dir, 'train.csv'),
        os.path.join(data_dir, 'test.csv'),
        os.path.join(data_dir, 'submission.csv'),
    )
