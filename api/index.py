import sys
import os

# Add the project root to the Python path so Vercel can resolve 'backend' imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
