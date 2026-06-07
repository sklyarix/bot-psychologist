/**
 * Middleware: проверяет, что аутентифицированный пользователь имеет роль admin.
 * Должен использоваться ПОСЛЕ middleware `auth`.
 */
export const requireAdmin = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({ error: 'unauthorized' })
	}

	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'forbidden: admin only' })
	}

	return next()
}
