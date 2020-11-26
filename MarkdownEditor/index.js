import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';

var showdown  = require('showdown');
let converter = new showdown.Converter();
// html = ;

import css from './style.css';

function MarkdownEditor({ file, write }) {
    const [value, setValue] = useState('');
    const [inner, setInner] = useState('');
    const [editable, setEditable] = useState('');
    useEffect(() => {
      (async () => {
          let text = await file.text();
          text = converter.makeHtml(text);
          setValue(text);
      })();
    }, [file]);

    let contentBox = React.createRef();
    let editableBox = React.createRef();
    const saveText = () => {
        let element = editableBox.current;
        let firstTag = element.firstChild.nodeName;
        let keyTag = new RegExp(
        firstTag === '#text' ? '<br' : '</' + firstTag, 'i');

        let tmp = document.createElement('p');
        tmp.innerHTML = element.innerHTML
        .replace(/<[^>]+>/g, (m, i) => (keyTag.test(m) ? '{ß®}' : ''))
        .replace(/{ß®}$/, '');

        let textToWrite =  tmp.innerText.replace(/{ß®}/g, '\n');

        let text = converter.makeHtml(textToWrite);
        setValue(text);
        setEditable(false)
        const fileToWrite = new File(
            [textToWrite],
            file.name,
            {
                type: file.type,
                lastModified: new Date()
            }
        )
        write(fileToWrite);
    }

    const focus = () => {
        let html = contentBox.current.innerHTML;
        let md = converter.makeMarkdown(html);
        setInner(md)
        setEditable(true)
    }

    return (
        <div className={css.preview}>
          <div className={css.title}>
              <span><small>{path.basename(file.name)}</small></span>
          </div>
          {editable ? (
              <div className={css.content}
                  ref={editableBox}
                  suppressContentEditableWarning={true}
                  onBlur={saveText}
                  contentEditable="true">{inner}</div>
          ):(
              <div className={css.content}
                  ref={contentBox}
                  onBlur={saveText}
                  onClick={focus}
                  dangerouslySetInnerHTML={{__html: value}}></div>
          )}

        </div>
    );

}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
