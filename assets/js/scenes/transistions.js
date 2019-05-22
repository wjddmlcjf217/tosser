/**
 *  Fade a scene out to a solid color
 *  @param scene The scene to apply the transition to
 *  @param color The color to fade to
 *  @param time The duration of the fade rectangle
 */
export function fadeOut(scene, color, time) {
    let fade = scene.add.rectangle(
        window.innerWidth * 0.5, window.innerHeight * 0.5, window.innerWidth, window.innerHeight, color, 1);
    fade.setDepth(1000);
    fade.setAlpha(0);
    return scene.tweens.add({
        targets: fade,
        alpha: 1.0,
        ease: 'Linear',
        duration: 500,
        repeat: 0
    })
}

/**
 *  Fade a scene in from a solid color
 *  @param scene The scene to apply the transition to
 *  @param color The color to fade from
 *  @param time The duration of the fade rectangle
 */
export function fadeIn(scene, color, time) {
    let fade = scene.add.rectangle(
        window.innerWidth * 0.5, window.innerHeight * 0.5, window.innerWidth, window.innerHeight, color, 1);
    fade.setDepth(1000);
    return scene.tweens.add({
        targets: fade,
        alpha: 0,
        ease: 'Linear',
        duration: time,
        repeat: 0
    });
}