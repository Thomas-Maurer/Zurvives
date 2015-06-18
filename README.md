# Zurvives
Adaptation of Zombicide

## Team

| Name  |  Role | Contact
| ------------- | ------------- | ------------- |
| Ivan Daum  | Team leader | ivan.daum@gmail.com |
| Thomas Maurer  | Back-end developper | thomas.wellan@gmail.com |
| Sami Errighi  | Back-end developper | sami.errighi@gmail.com |
| Alain Cajuste  | Front-end developper | cajuste.alain@gmail.com |
| Antoine Grélard  | Designer & front-end developper | antoine.grelard@gmail.com |

## Techno

* [Bower-rails](https://github.com/rharriso/bower-rails)
* Angular
* Rails
* Nodejs
* [Mailcatcher](http://mailcatcher.me/) - *dev mail*
* Susy

## Server

The server use a Ruby on Rails structure. The vagrant configuration can be found at the [vagrant project repository](https://github.com/Metali/Vagrant_init)

## Usefull commands

* Install Bower dependencies : ``` rake bower:install ```
* Start Rails server : ``` rails s -b 0.0.0.0 ```

* Load fixtures : ``` rake db:fixtures:load ```
* Load mailcatcher : ``` mailcatcher --http-ip=0.0.0.0 ```

## Node
* go to node-zurvives folder
* Install npm dependencies dependencies : ``` npm install ```
* Start node server : ``` node app.js ```

The default port is 8000

## Database

go to `config/` and execute following commands :
```shell
cp database.yml.dist database.yml
cp secrets.yml.dist secrets.yml
```

Then go to the root path of our directory and execute 
```ruby
rake db:create
rake db:reset
```

