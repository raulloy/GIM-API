import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getContacts } from '../api';
import Contact from '../models/contactModel';

const contactRouter = express.Router();

contactRouter.get(
  '/create-contacts',
  expressAsyncHandler(async (req, res) => {
    const paginationLimit = (startValue, numElements) => {
      return Array(numElements)
        .fill(0)
        .map((_, index) => startValue + index * 100);
    };

    for (const value of paginationLimit(0, 100)) {
      const contacts = await getContacts(100, value);

      for (const contact of contacts) {
        const existingContact = await Contact.findOne({ id: contact.id });
        if (existingContact) {
          console.log(
            `Contact with id ${contact.id} already exists. Skipping...`
          );
          continue;
        }

        const newContact = new Contact(contact);
        try {
          await newContact.save();
        } catch (error) {
          console.error(`Error saving contact: ${error}`);
        }
      }
    }

    console.log("We're done!");

    // const contacts = await getContacts(100);

    // for (const contact of contacts) {
    //   const existingContact = await Contact.findOne({ id: contact.id });
    //   if (existingContact) {
    //     console.log(
    //       `Contact with id ${contact.id} already exists. Skipping...`
    //     );
    //     continue;
    //   }

    //   const newContact = new Contact(contact);
    //   try {
    //     await newContact.save();
    //   } catch (error) {
    //     console.error(`Error saving contact: ${error}`);
    //   }
    // }
  })
);
// userRouter.post(
//   '/signin',
//   expressAsyncHandler(async (req, res) => {
//     const signinUser = await User.findOne({
//       email: req.body.email,
//       password: req.body.password,
//     });
//     if (!signinUser) {
//       res.status(401).send({
//         message: 'Invalid Email or Password',
//       });
//     } else {
//       res.send({
//         _id: signinUser._id,
//         name: signinUser.name,
//         email: signinUser.email,
//         isAdmin: signinUser.isAdmin,
//         token: generateToken(signinUser),
//       });
//     }
//   })
// );
// userRouter.put(
//   '/:id',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       res.status(404).send({
//         message: 'User Not Found',
//       });
//     } else {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       user.password = req.body.password || user.password;
//       const updatedUser = await user.save();
//       res.send({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         isAdmin: updatedUser.isAdmin,
//         token: generateToken(updatedUser),
//       });
//     }
//   })
// );

export default contactRouter;
