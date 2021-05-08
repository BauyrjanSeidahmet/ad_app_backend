const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const config = require('./config');

const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect(config.getDbUrl(), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    await db.dropCollection('categories');
    await db.dropCollection('products');
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collection were not presented. Skipping drop');
  }

  const [compCategory, carsCategory, othersCategory] = await Category.create(
    {
      title: 'computers',
      description: 'Computers and their stuff',
    },
    {
      title: 'cars',
      description: 'Cars and their stuff',
    },
    {
      title: 'others',
      description: 'All other stuff',
    }
  );

  const [user1, user2] = await User.create(
    {
      username: 'user',
      password: 'user',
      displayName: 'firstUser',
      phone: '87772785676',
      token: nanoid(),
    },
    {
      username: 'admin',
      password: 'admin',
      displayName: 'secondUser',
      phone: '87772785676',
      token: nanoid(),
    }
  );

  await Product.create(
    {
      user: user1._id,
      title: 'Samsung',
      description: 'a very good computer trust me',
      price: 270000,
      category: compCategory._id,
      image: 'computer.jpeg',
    },
    {
      user: user2._id,
      title: 'Toyota Camry',
      description: 'a very good car trust me',
      price: 9750000,
      category: carsCategory._id,
      image: 'camry.jpeg',
    },
    {
      user: user1._id,
      title: 'Backpack',
      description: 'a very backpack car trust me',
      price: 8500,
      category: othersCategory._id,
      image: 'backpack.jpeg',
    }
  );

  await db.close();
});
