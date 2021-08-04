const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.likeSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    })
        // On récupère la sauce à modifier : sauce
        .then((sauce) => {
            res.status(200).json(sauce);

            console.log(req.params);

            // On créé le tableau des userLiked
            let userLikedIds = sauce.userLiked.split(',');

            // On créé le tableau des userDisliked
            let userDislikedIds = sauce.userDisliked.split(',');

            // On récupère l'id de l'user et son vote like
            const userId = req.body.userId
            let like = req.body.like;
            console.log('like: ' + like);

            // On vérifie si l'user est dans les tableaux userLiked et userDisliked
            let findUserLike = userLikedIds.indexOf(userId);
            let findUserDislike = userDislikedIds.indexOf(userId);

            // On met à jour les tableaux
            if (findUserLike === -1 && like === 1) {
                userLikedIds.push(userId);
                userDislikedIds.splice(findUserDislike);
                console.log('ajout')
            } else if (findUserLike !== -1 && like === 1) {
                console.log('ajout double impossible')
            }

            if (like === 0) {
                userLikedIds.splice(findUserLike);
                userDislikedIds.splice(findUserDislike);
                console.log('reset')
            }
            if (findUserDislike === -1 && like === -1) {
                userLikedIds.splice(findUserLike);
                userDislikedIds.push(userId);
                console.log('retrait')
            } else if (findUserDislike !== -1 && like === -1) {
                console.log('retrait double impossible')
            }

            // On met à jour le score like
            sauce.likes = userLikedIds.length -1;

            // On met à jour le score dislike
            sauce.dislikes = userDislikedIds.length -1;

            // On met à jour la liste des likes
            sauce.userLiked = userLikedIds.join(',');

            // On met à jour la liste des dislikes
            sauce.userDisliked = userDislikedIds.join(',');

            // On enregistre la sauce
            sauce.save()
                .then(() => {
                    res.status(201).json({
                        message: 'Avis enregistré !'
                    })
                })
                .catch((error) => {
                    res.status(400).json({
                        error: error
                    })
                });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        });
};

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'Sauce enregistrée !'
            })
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            })
        });
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => {
        res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            })
        });
};

exports.modifySauce = (req, res) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: 'Sauce modifiée !'
            })
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            })
        });
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({
                            message: 'Sauce supprimée !'
                        })
                    })
                    .catch((error) => {
                        res.status(400).json({
                            error: error
                        })
                    });
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        });
};

exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
};