import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import {registerImageChooserButton} from './src/ImageChooserButton.js';

export default class PanelImageBackgroundPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    this._resources = Gio.Resource.load(this.path + '/resources/panel-background-image.gresource');
    Gio.resources_register(this._resources);

    registerImageChooserButton();

    this._builder = new Gtk.Builder();
    this._builder.add_from_resource(`/ui/settings.ui`);

    this._settings = this.getSettings();

		this._bind(`desktop-mode-image`, `file`)
		this._bind(`overview-mode-image`, `file`)

		window.add(this._builder.get_object('general-page'))
  }

  _bind(settingsKey, property) {
    this._settings.bind(settingsKey, this._builder.get_object(settingsKey), property,
                        Gio.SettingsBindFlags.DEFAULT);

    const resetButton = this._builder.get_object('reset-' + settingsKey);
    resetButton.connect('clicked', () => {
      this._settings.reset(settingsKey);
    });
  }
}
