# Bible Data Structure

This directory contains Bible text data and audio files for multiple Bible versions.

## Directory Structure

```
mobile/books/
├── versions/           # Bible text data organized by version
│   ├── NIV/           # New International Version
│   ├── KJV/           # King James Version
│   ├── NLT/           # New Living Translation
│   ├── LSB/           # Legacy Standard Bible
│   ├── ESV/           # English Standard Version
│   └── CPDV/          # Catholic Public Domain Version
├── audio/             # Audio files organized by version and language
│   ├── NIV/
│   │   ├── en/        # English audio files
│   │   └── sw/        # Swahili audio files
│   ├── KJV/
│   │   ├── en/
│   │   └── sw/
│   ├── NLT/
│   │   ├── en/
│   │   └── sw/
│   ├── LSB/
│   │   ├── en/
│   │   └── sw/
│   ├── ESV/
│   │   ├── en/
│   │   └── sw/
│   └── CPDV/
│       ├── en/
│       └── sw/
├── Books.json         # Master book list (all versions)
├── Genesis.json       # Legacy single-version files (will be migrated)
├── Exodus.json
├── ... (other book files)
└── README.md          # This file
```

## Bible Versions

Supported Bible versions with their codes:

- **NIV** - New International Version
- **KJV** - King James Version  
- **NLT** - New Living Translation
- **LSB** - Legacy Standard Bible
- **ESV** - English Standard Version
- **CPDV** - Catholic Public Domain Version

Each version will have text data in both English and Swahili, plus audio files for both languages.

## Data Format

### Book JSON Files
Each book JSON file should follow this structure:

```json
{
  "book": "Genesis",
  "version": "NIV",
  "language": "en",
  "chapters": [
    {
      "chapter": "1",
      "verses": [
        {
          "verse": "1",
          "text": "In the beginning God created the heaven and the earth.",
          "audio_url": "audio/NIV/en/Genesis/Genesis_1_1.mp3"
        }
      ]
    }
  ]
}
```

### Audio Files
Audio files should be organized as:
- `audio/{VERSION}/{LANGUAGE}/{BOOK}/{BOOK}_{CHAPTER}_{VERSE}.mp3`
- Example: `audio/NIV/en/Genesis/Genesis_1_1.mp3`

## Migration Plan

1. Current single-version JSON files will be migrated to the new structure
2. Default version will be KJV (King James Version) for existing data
3. Additional versions will be added as data becomes available
4. Audio files will be added for each version and language combination

## API Integration

The mobile app will:
1. Allow users to select their preferred Bible version
2. Load text data from the appropriate version folder
3. Provide audio playback when available
4. Cache frequently used books and audio files

## Notes

- The existing JSON files in the root `books/` directory are legacy files
- New development should use the `versions/` subdirectory structure
- Audio files are optional - the app should work without them
- Swahili translations may not be available for all versions initially