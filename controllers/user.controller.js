import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1
      });

    return res.json({
      users
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const {
      role
    } = req.body;

    if (
      !["admin", "user"].includes(role)
    ) {
      return res.status(400).json({
        message: "Role must be admin or user"
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          role
        },
        {
          new: true,
          runValidators: true
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update user",
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (
      req.user.id === req.params.id
    ) {
      return res.status(400).json({
        message:
          "Admin cannot delete their own account"
      });
    }

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
};