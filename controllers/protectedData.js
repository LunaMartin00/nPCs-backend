export const protectedData = (req, res) => {
    res.status(200).json({ message: "Datos protegidos accedidos", user: req.user });
};