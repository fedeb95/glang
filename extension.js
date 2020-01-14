
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Gdk = imports.gi.Gdk;
const Clutter = imports.gi.Clutter;

let text, button, last_word = "";
let words = [];
let MAX_QUEUE = 3

function _handleKeyPress(widget, event, user_data) {
    let keyval = event.get_key_symbol();
    let keyname = Gdk.keyval_name(keyval); // string keyname

    if(keyname && keyname.length == 1)
        last_word += keyname;
    else if(keyname == "space"){
        words.push(last_word);
        if(words.length > MAX_QUEUE)
            words.shift();
     }
}

function _hideLabel(){
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showLabel(){
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: words.join("\n")});

        Main.uiGroup.add_actor(text);
    }
    text.opacity = 255;
    let monitor = Main.layoutManager.primaryMonitor;
    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
        Math.floor(monitor.height / 2 - text.height / 2));
    Tweener.addTween(text, { opacity: 0, time: 2, transition: 'easeOutQuad', onComplete: _hideLabel })
}

function init() {
    button = new St.Bin({
        style_class: 'panel-button',
        reactive: true, can_focus: true, x_fill: true, y_fill:true,
        track_hover: true
    });
    // TODO show alternative in icon according to settings (auto-replace or just show alternative)
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });
    button.set_child(icon)
    button.connect('button-press-event', _showLabel);
    global.stage.connect("key-press-event", _handleKeyPress);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
