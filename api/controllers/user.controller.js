import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({ message: 'API route is working!' });
};

export const updateUser = async (req, res, next) => {
    // 1. Security Check: Is the user updating their own profile?
    // (This requires the verifyToken middleware to be working)
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own account!'));
    }

    try {
        // 2. If the user is changing their password, hash it first
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // 3. Update the user in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar, // This is your Cloudinary URL!
                },
            },
            { new: true } // Returns the updated document instead of the old one
        );

        // 4. Remove the password from the response for security
        const { password, ...rest } = updatedUser._doc;

        // 5. Send back the updated user data (without the password)
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account!'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token'); // Clear the authentication cookie
        res.status(200).json('User has been deleted.');
    } catch (error) {
        next(error);
    }
};