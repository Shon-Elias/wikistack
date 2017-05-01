var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

// Our schemas:
// model defination for  Page and User
const Page = db.define('page', {
  title: {type: Sequelize.STRING, allowNull: false},
  urlTitle: {type: Sequelize.STRING, allowNull: false},
  content: {type: Sequelize.TEXT, allowNullL: false},
  // 	if the page is open or closed
  status: {type: Sequelize.ENUM('open', 'close'), defaultValue: 'close'},
  tags: Sequelize.ARRAY(Sequelize.STRING)
},
  {
    getterMethods: {
      route: function(){
        return `/wiki/${this.getDataValue('urlTitle')}`;
      }
    },
    classMethods: {
      findByTag: function(tags) {
        return this.findAll({
            where : {
                tags: {
                    $overlap: tags
                }
            }
        });
      }
    },
    instanceMethods: {
      findSimilar: function() {
        return Page.findAll({
          where: {
            tags: {
              $overlap: this.tags
            },
            $and: {
              id: {
                $not: this.id
              }
            }
          }
        })
      }
    }
  }
);


// Our hooked make sure to call the urlBuilder function and use reguler
// expression to set
Page.hook('beforeValidate', function(page){
// Page.beforeBulkCreate(function(page){

  page.urlTitle = urlBuilder(page.title);

});

function urlBuilder(title){
  // has no non-alphanumeric characters
  // uses underscores instead of spaces
  return title.replace(/\W/g, '_');

}



const User = db.define('user',{
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  //	Creates a unique, identifying email address
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

// Associating Pages with Users
Page.belongsTo(User, { as: 'author' });

//module.exports = { Page: Page, User: User };
module.exports = {db, User, Page};

