#!/bin/bash

# Check if source and destination directories are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <source_directory> <destination_directory>"
    exit 1
fi

# Assign arguments to variables
source_dir="$1"
dest_dir="$2"

# Check if source directory exists
if [ ! -d "$source_dir" ]; then
    echo "Error: Source directory does not exist."
    exit 1
fi

mkdir -p "$dest_dir"

# Function to copy files
copy_files() {
    local current_dir="$1"
    
    # Loop through all files in the current directory
    for file in "$current_dir"/*; do
        # Get the base name of the file or directory
        base_name=$(basename "$file")
        
        # Skip node_modules and build directories
        if [ "$base_name" = "node_modules" ] || [ "$base_name" = "build" ]; then
            continue
        fi
        
        if [ -f "$file" ]; then
            # If it's a file, copy it to the destination
            cp "$file" "$dest_dir"
        elif [ -d "$file" ]; then
            # If it's a directory, recursively call this function
            copy_files "$file"
        fi
    done
}

# Start the copying process
copy_files "$source_dir"

echo "File copying completed. node_modules and build folders were ignored."