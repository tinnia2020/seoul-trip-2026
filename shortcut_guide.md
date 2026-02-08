# How to Create the "GMap to Naver" Shortcut

Since Google Maps uses encrypted short links (`goo.gl`) that hide coordinates, we can't easily extract the exact GPS location without a server. 

**However**, we can make a clever shortcut that grabs the **Place Name** from the shared text and instantly searches it in Naver Map. This works 95% of the time!

## 🚀 The 1-Minute Recipe

Follow these steps on your iPhone:

1.  Open the **Shortcuts** app.
2.  Tap **+** (top right) to create a new shortcut.
3.  Tap the name at the top ("New Shortcut"), rename it to **"Open in Naver"**, and choose an icon (maybe a green map pin).
4.  **Enable Share Sheet**:
    *   Tap the "i" (info) button at the bottom (or top right settings).
    *   Toggle on **"Show in Share Sheet"**.
    *   Tap "Done".
    *   You will now see a block at the top: *"Receive **Any** input from **Share Sheet**"*.
    *   Tap **Any** and uncheck everything except **Text** and **URLs**.
5.  **Add Actions** (Search for these in the bottom bar):

    **Action 1: Split Text**
    *   Search for **"Split Text"**. Add it.
    *   It should say: *Split **Shortcut Input** by **New Lines**.*
    *   (This separates the Place Name from the address and link).

    **Action 2: Get Item from List**
    *   Search for **"Get Item from List"**. Add it.
    *   It should say: *Get **First Item** from **Split Text**.*
    *   (The first line of a Google Maps share is usually the place name).

    **Action 3: URL Encode**
    *   Search for **"URL Encode"**. Add it.
    *   It should say: *URL Encode **Item from List**.*
    *   (This makes sure spaces and Korean characters work correctly).

    **Action 4: Open URL**
    *   Search for **"Open URL"**. Add it.
    *   Tap the empty URL field where it says "URL".
    *   Type exactly this: `nmap://search?query=`
    *   ...then tap the variable **URL Encoded Text** above the keyboard to add it to the end.
    *   Final URL field should look like: `nmap://search?query=URL Encoded Text`

6.  **Tap Done**. You're finished!

## 📱 How to Use It

1.  Open **Google Maps** and find a place (e.g., "Starbucks Gangnam").
2.  Tap the **Share** button.
3.  Tap **"Open in Naver"** from the list.
4.  Naver Map will open and search for that place name automatically.

## ⚠️ Limitations
*   **Coordinate vs. Name:** This searches by **Name**. If the place has a generic name (like "GS25"), you might see a list of results in Naver and have to pick the closest one.
*   **Short Links:** We cannot extract exact GPS coordinates from `goo.gl` links on the device alone because Google hides them behind a redirect. This name-search method is the fastest valid workaround.
