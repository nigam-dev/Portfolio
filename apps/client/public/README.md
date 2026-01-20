# Public Assets Folder

Place static images here that you want to serve directly:

## Usage:
- Add images: `public/images/example.png`
- Reference in code: `/images/example.png`

## Recommended Structure:
```
public/
  ├── images/
  │   ├── profile/
  │   ├── projects/
  │   └── logos/
  ├── icons/
  └── files/
      └── resume.pdf
```

## Note:
For dynamic content (profile, projects, etc.), use the admin panel to upload images.
Those will be stored on the backend and fetched via API.
