var Sequelize = require('sequelize');
var marked = require('marked');

// the path for our db name wikistack
// the port is sequlize port
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false, typeValidation: true});

// Our schemas:
// model defination for  Page and User
const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },   // end of first argument
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },   // end of 2nd argument
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  // 	if the page is open or closed
  status: {
    type: Sequelize.ENUM('open', 'close'),
    validate: {
      isIn: [['open', 'close']]
    },
    defaultValue: 'close',
    typeValidation: true
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    validate: {
      isArrayOfStrings: function(arr){
        arr.forEach( value => {
          if (typeof value !== 'string') throw new Error('Should be an Array of Strings')
        })
      }
    }
  }
},
  {
    getterMethods: {
      route: function(){
        return `/wiki/${this.getDataValue('urlTitle')}`;
      },
      renderedContent: function() {
        return marked(this.content)
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

