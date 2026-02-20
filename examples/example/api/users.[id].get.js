export default (req) => json({ id: req.params?.id ?? '?', name: 'User ' + (req.params?.id ?? '') })
