import React, { PropTypes } from 'react';

import { prefix } from '../../../../util/prefix';
import { CLASS_NAMES } from '../../../../constants/GridConstants';
import {
    dismissEditor
} from './../../../../actions/plugins/editor/EditorActions';
import { saveRow } from './../../../../actions/plugins/editor/EditorActions';

export const Button = ({
    BUTTON_TYPES,
    saveText,
    cancelText,
    editorState,
    events,
    stateKey,
    store,
    type
}) => {

    const text = type === BUTTON_TYPES.SAVE ? saveText : cancelText;

    const buttonProps = {
        onClick: onButtonClick.bind(
            this,
            BUTTON_TYPES,
            editorState,
            events,
            type,
            stateKey,
            store
        ),
        className: type === BUTTON_TYPES.SAVE
            ? prefix(CLASS_NAMES.EDITOR.INLINE.SAVE_BUTTON)
            : prefix(CLASS_NAMES.EDITOR.INLINE.CANCEL_BUTTON)
    };

    if (type === BUTTON_TYPES.SAVE
            && editorState
            && editorState.row
            && !editorState.row.valid) {
        buttonProps.disabled = true;
    }

    return (
        <button { ...buttonProps } >
            { text }
        </button>
    );
};

Button.propTypes = {
    BUTTON_TYPES: PropTypes.object,
    cancelText: PropTypes.string,
    events: PropTypes.object,
    saveText: PropTypes.string,
    store: PropTypes.object,
    type: PropTypes.string
};

Button.defaultProps = {
    BUTTON_TYPES: {
        CANCEL: 'CANCEL',
        SAVE: 'SAVE'
    },
    cancelText: 'Cancel',
    saveText: 'Save'
};

export const onButtonClick = (
    BUTTON_TYPES, editorState, events, type, stateKey, store
) => {

    if (type === BUTTON_TYPES.CANCEL) {
        store.dispatch(dismissEditor({ stateKey }));
    }

    else if (type === BUTTON_TYPES.SAVE) {

        store.dispatch(
            saveRow({
                values: editorState.row.values,
                rowIndex: editorState.row.rowIndex,
                stateKey
            })
        );

        if (events.HANDLE_AFTER_INLINE_EDITOR_SAVE) {
            const values = editorState.row.values;

            events.HANDLE_AFTER_INLINE_EDITOR_SAVE({
                values, editorState
            });
        }

        store.dispatch(dismissEditor({ stateKey }));
    }
};