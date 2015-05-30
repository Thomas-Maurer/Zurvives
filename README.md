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

## Server

The server use a Ruby on Rails structure. The vagrant configuration can be found at the [vagrant project repository](https://github.com/Metali/Vagrant_init)

## Usefull commands

* Install Bower dependencies : ``` rake bower:install ```
* Start Rails server : ``` rails s -b 0.0.0.0 ```

* Load fixtures : ``` rake db:fixtures:load ```