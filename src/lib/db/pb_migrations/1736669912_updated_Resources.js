/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_163352469")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file749574446",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "File",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_163352469")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file749574446",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "File",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
