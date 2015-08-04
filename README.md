#Tecnopolis Dropbox Image Server (TecnoBox)

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

Default port is *8080*

# Configuration
* Create an App in https://www.dropbox.com/developers/apps
* Go to the App profile
* Obtain the *App key* and *App secret*
* Generate an *App Token* by clicking the "Generate" button under the Generated access token header

Then set the following ENV variables:

```js
DBOXKEY=App Key
DBOXSECRET=App Secret
DBOXTOKEN=App Token
```
If this configuration is missing, the script won't start!

## Pictures filename
Pictures can be JPG, JPEG and PNG extension only. The filename is composed of: category_region_timestamp.extension
The only important field here is the *category*.

# Models
## Picture
```js
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
```js
show databases
use tecnobox-dev
db.pictures.remove({userId: '891231'})
```

# Routes

## GET /Sync - Sync DropBox with Database
Triggers a sync, the response will be 200 if everything is OK or 300 if something failed.
If a category is not specified in the original image filename, it defaults to "unknown".
A safety check is present: You can't trigger the sync if the last one was less than 5 minutes ago.
Before sync starts, each saved picture existence will be verified.

```js
GET: /sync
```

## GET /Pictures - Retrieve all pictures url [Paginated]
Asks for all the available pictures url. Category and date filter is optional. The links are public for everyone.
```js
GET: /pictures

Allowed query params:
{
  category: String,
  start_date: String,
  end_date: String,
  page: Integer [default=1],
  limit: Integer [default=10]
}

Valid date strings:
"2013-02-08 09:30"         # An hour and minute time part
"2013-02-08 09:30:26"      # An hour, minute, and second time part
"1410715640579"            # Unix ms timestamp

[http://momentjs.com/docs/#/parsing/string]
```
