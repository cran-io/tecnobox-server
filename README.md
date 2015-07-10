# tecnobox-server
Tecnopolis Dropbox Image Server.

The server syncs a Public DropBox folder searching for .PNG and .JPEG files.

# Pictures filename
Pictures can be JPEG and PNG extension only. The filename is composed of: category_region_timestamp.png

# Configuration
Configure a DropBox App and get the Key, Secret and Token. Then set the following ENV variables:

```
DBOXKEY=App Key
DBOXSECRET=App Secret
DBOXTOKEN=App Token
```


# Routes

## Sync DropBox with Database
Triggers a sync, the response will be 200 if everything is OK or 300 if something failed.
If a category is not specified in the original image filename, it defaults to "UNKNOWN".

```
GET: /sync
```

## Retrieve all images url
Asks for all the available images url. The links are public for everyone.

```
GET: /images
```

## Retrieve all images url for a specific category
Asks for all the available images url for a specific category. Category is a 1 word String. The links are public for everyone.

```
GET: /images/:category
```
