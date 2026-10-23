#!/usr/bin/env python3
"""
Build script to create standalone Python executable for AetherFlow AI model
"""
import os
import subprocess
import sys
import shutil

def main():
    print("🔧 Building AetherFlow AI Server...")
    
    # Change to model directory
    model_dir = os.path.join(os.path.dirname(__file__), 'model')
    os.chdir(model_dir)
    
    # Install PyInstaller if not present
    try:
        import PyInstaller
    except ImportError:
        print("📦 Installing PyInstaller...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pyinstaller'])
    
    # Create the executable
    print("🚀 Creating standalone executable...")
    
    # Get the full paths to the model files
    enhanced_model_path = os.path.abspath('enhanced_sickle_cell_model.pkl')
    crisis_model_path = os.path.abspath('sickle_cell_crisis_model.pkl')
    
    cmd = [
        'pyinstaller',
        '--onefile',
        '--name', 'aetherflow-ai-server',
        '--distpath', '../ai-server',
        '--workpath', 'build',
        '--specpath', 'build',
        '--add-data', f'{enhanced_model_path};.',
        '--add-data', f'{crisis_model_path};.',
        '--hidden-import', 'sklearn.ensemble._forest',
        '--hidden-import', 'sklearn.tree._tree',
        '--hidden-import', 'sklearn.neighbors._typedefs',
        '--hidden-import', 'sklearn.neighbors._quad_tree',
        '--hidden-import', 'sklearn.tree',
        '--hidden-import', 'sklearn.neighbors._partition_nodes',
        'inference_api.py'
    ]
    
    subprocess.check_call(cmd)
    
    print("✅ AI Server executable created at: ../ai-server/aetherflow-ai-server.exe")
    print("🎉 Build complete!")

if __name__ == "__main__":
    main()
