#!/usr/bin/bash

EXTENSION_ID='panel-background-image@shylysmiling.github.io'

EXTENSIONS_DIR="$HOME/.local/share/gnome-shell/extensions"
INSTALL_DIR="${EXTENSIONS_DIR}/${EXTENSION_ID}"

compile_resources() {
	for filename in resources/panel-background-image.gresource.xml resources/ui/settings.ui resources/ui/imageChooserButton.ui; do
		if [ "$filename" -nt "resources/panel-background-image.gresource" ]; then
			echo "Compiling resource \"$filename\"."
			"$SHELL" -c 'cd resources; glib-compile-resources panel-background-image.gresource.xml'
			return
		fi
	done
}

compile_schemas() {
	if [ "schemas/gschemas.compiled" -ot "schemas/org.gnome.shell.extensions.panel-background-image.gschema.xml" ]; then
		glib-compile-schemas schemas
	fi
}

install() {
	mkdir -v -p "$INSTALL_DIR"
	mkdir -v -p "$INSTALL_DIR/schemas"
	mkdir -v -p "$INSTALL_DIR/resources"

	cp --update -v resources/panel-background-image.gresource "${INSTALL_DIR}/resources"
	cp --update -v schemas/gschemas.compiled "${INSTALL_DIR}/schemas"

	cp --update -r -v extension.js prefs.js metadata.json src "${INSTALL_DIR}/"
}

case "$@" in
	'install' ) install ;;
	'compile-resources' ) compile_resources ;;
	'compile-schemas' ) compile_schemas ;;
	'' ) compile_resources && compile_schemas && install ;;
	* ) exit 1 ;;
esac
