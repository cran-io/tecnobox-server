# tecnobox-server
Tecnopolis Dropbox Image Server.

The server syncs a Public DropBox folder searching for image files.
A scheduled job will run every 15 minutes to trigger the sync. You can also run it manually (keep reading).

# Installation
Install dependencies:
```js
npm install
```

Run the server:
```js
node server
```

# Configuration
First create an App in https://www.dropbox.com/developers/apps
Go to the App profile
Obtain the *App key* and *App secret* (visible)
Generate an App Token (clicking the *Generated access token* button)

Then set the following ENV variables:

```
DBOXKEY=App Key
DBOXSECRET=App Secret
DBOXTOKEN=App Token
```
If this configuration is missing, the script won't start!

## Pictures filename
Pictures can be JPEG and PNG extension only. The filename is composed of: category_region_timestamp.png

# Models
## Picture
```
  {
  path: String,     //Unique relative path to /Public folder
  name: String,     //Name of the file
  userId: String,   //DropBox userId associated
                    //with the App configuration account
  url: String,      //public link to this picture
  category: String, //category name
  date: Date        //DropBox file updated date
}

```
The userId is useful for deleting massive invalid pictures from the mongo console. The query process would be something like:
```
show databases
use tecnobox-dev
db.pictures.remove({userId: '891231'})
```

# Routes

## Sync DropBox with Database
Triggers a sync, the response will be 200 if everything is OK or 300 if something failed.
If a category is not specified in the original image filename, it defaults to "unknown".
A safety check is present: You can't trigger the sync if the last one was less than 5 minutes ago.

```
GET: /sync
```

## Retrieve all images url [Paginated]
Asks for all the available images url. Category filter is optional. The links are public for everyone.
```
GET: /images

params {
  category: String,
  page: Integer [default=1],
  limit: Integer [default=10]
}
```
