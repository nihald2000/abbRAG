# Uploaded Files Directory

This directory stores all files that are uploaded to the backend for processing and storage in the vector database.

## Directory Structure

```
uploads/
├── temp/           # Temporary files during upload
├── processed/      # Successfully processed files
├── failed/         # Files that failed processing
└── vector_db/      # Files ready for vector database storage
```

## File Types Supported

- `.log` - Log files
- `.txt` - Text files
- `.json` - JSON log files
- `.csv` - CSV data files

## Processing Workflow

1. **Upload**: Files are initially stored in `temp/`
2. **Processing**: Files are parsed and analyzed
3. **Success**: Moved to `processed/` and `vector_db/`
4. **Failure**: Moved to `failed/` with error logs

## Vector Database Integration

Files in `vector_db/` are:
- Converted to embeddings
- Stored in vector database
- Indexed for semantic search
- Available for AI chat queries

## Security

- Files are scanned for malicious content
- Sensitive data is redacted
- Access is restricted to authorized users
- Files are automatically cleaned up after processing
