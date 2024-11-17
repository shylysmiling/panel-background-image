import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js'

export default class PlainExampleExtension extends Extension {
	enable() {
		this._settings = this.getSettings()

		this._panel = Main.panel

		if(!this._panel) {
			throw `Main panel doesn't exists!!!`
		}

		this._originalStyle = this._panel.get_style()

		this._setupHooks()
		this._setBackgroundImage()
	}

	disable() {
		this._removeHooks()
		this._revertBackgroundImage()
	}

	_setBackgroundImage() {
		var uri = this._settings.get_string(
			Main.overview.visible ? `overview-mode-image` : `desktop-mode-image`
		)

		if(uri) {
			this._panel.set_style(`background-image: url("${uri}")`)
		} else {
			this._revertBackgroundImage()
		}
	}

	_revertBackgroundImage() {
		this._panel.set_style(this._originalStyle)
	}

	_setupHooks() {
		this._addSettingsHook(`changed::desktop-mode-image`,  () => this._setBackgroundImage())
		this._addSettingsHook(`changed::overview-mode-image`, () => this._setBackgroundImage())
		this._addPanelHook("style-changed", () => this._setBackgroundImage())
	}

	_removeHooks() {
		if(this._hooks) {
			this._hooks.forEach(hook => hook.object.disconnect(hook.cookie))
		}
	}

	_addPanelHook(signal, action) {
		return this._addHook(this._panel, signal, action)
	}

	_addSettingsHook(signal, action) {
		return this._addHook(this._settings, signal, action)
	}

	_addHook(obj, signal, action) {
		if(this._hooks === undefined) {
			this._hooks = []
		}

		this._hooks.push({
			object: obj,
			cookie: obj.connect(signal, action)
		})
	}
}
