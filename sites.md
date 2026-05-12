# Sites Management

Here we define the core of webCV, the Sites Management, which allows the user to manage their cv sites.

## 'Moje strony' sites view

This is the dashboard subpage where the user can see all their sites.

Here, user can create a new site and view all the created sites (utilizing the simplified /sites endpoint).

Data should be displayed as cards (1-col grid mobile, 3-col desktop), each card represents a site and should contain the following information:
1. Full name
2. Site avatar (if added)
3. Job title
4. Created at
5. Action buttons (edit, publish, delete)

Delete action should be protected with a confirmation modal.

## Create a new site view & edit site view

These are the views where user can create and edit their CV sites.

In these views, we display a site form, where user can define all the parameters of the CV site, as with POST/PUT /sites.
Ensure validation of the entered data. (`fullName` is required)
Sections (eg basic data, skills, experience, etc) should be clear, separated and highlighted with icon & header.
Array fields should provide an easy way to add, edit and remove items.
Fields should be marked as required, when they are required.
Regarding image uploads (avatar and photos), ensure proper validation of file types and sizes (jpeg, png, webp, gif, max 50 MB), and respect the upload logic (`/storage/upload` to correct bucket, then use the returned `storagePath`). Images should be displayed as thumbnails. Images can be deleted (e.g. by "x" button on the thumbnail), in which case FIRST we should call DELETE `/storage/file` with the storage path&bucket, and ONLY THEN their respective field should be unset.

The layout for these views should be separate from the dashboard, and span full viewport width - no global container.

Desktop layout:
--------header--------
< Back to sites button (left) | site name at the top | export btn at right (edit only).
----------Site content (fill height)
<Form ~500px> | <Site area>
----------
(no footer on this view)

Mobile layout:
--------header--------
< Back to sites button (left) | site name at the top.
______
<export btn> (edit only)
----------------
<Form ~500px>
<preview site btn>
--------
<Site area> (if preview clicked, as full-height modal, with x btn)
--------
(no footer on this view)

### Form mechanics
#### Create site
User click on create site, then the create site view opens.
The view presents an empty form on the left, and on the right (Desktop), it displays 'Fill some data and save to see preview.' On mobile, the 'preview site' btn is hidden.
After filling form and clicking save, we attempt to POST /sites. If successful, it should automatically redirect to the edit site view for the newly created site.

#### Edit site
Edit site view is similar to the create site view, but it displays the data of the selected site. User can edit the data and save it, which will update the site.
Right column displays live preview (desktop), or on mobile, 'preview site' btn opens modal with the preview.
The preview is fetched via GET /generator/preview/{siteId}, and should be displayed after getting initial form data, then updated automatically when form data changes.
The preview is an inline HTML which should be rendered in an iframe.

## Export/publish site
After successfully creating or updating the site, user can deploy it by clicking the 'publish' btn in dashboard sites view, or in edit site view (right column).
After clicking, this should fire GET /generator/zip/{siteId} and trigger download of the returned zip file.
After triggering the download, a modal should appear with an instruction on how to deploy the site to an FTP hosting (via uploading the contents of the zip file to a hosting provider, with FileZilla mentioned as an example software, or by deploying to GitHub Pages).

## AI Analyzer
In the sites form, on the upper part, there should be a rainbow-colored-border area with user-engaging text eg 'Asystent AI wypełni pola za Ciebie!'
This part should contain a button that opens file uploader (PDF only, max 5MB). After placing a file, it should be uploaded to the backend (`/ai/analyze-cv`). After successful response, we should present all the proposed extracted data, with the option to accept or reject individual fields or whole response. If accepted, the data should be populated into the form fields, overwriting existing values. In any case on close, we should reset the AI analyzer's file picker state.

## Notes
- File uploaders (both PDF and images) should have d&d functionality. Ensure that on mobile it can open the phone's file explorer (instead of immediately camera).
- Keep in-line with current design, colorway & libs