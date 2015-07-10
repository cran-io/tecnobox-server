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
