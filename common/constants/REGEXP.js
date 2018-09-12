const REGEXP = {
  validations: {
    email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/,
    userName: /^[a-zA-Z '"_\-.\u00E0-\u00FC]{2,}$/,
    password: /^[a-zA-Z0-9]{6,}$/
  },
  path: {
    params: /\/:([a-z0-9]*)/gi
  },
  hashtag: /#([a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_-]*)/igm,
  mongoId: /^[0-9a-fA-F]{24}$/
}

module.exports = REGEXP