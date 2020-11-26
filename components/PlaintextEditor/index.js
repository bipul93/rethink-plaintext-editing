import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';

import css from './style.css';

function PlaintextEditor({ file, write }) {
  // console.log(file, write);
  const [value, setValue] = useState('');
  useEffect(() => {
    (async () => {
        setValue(await file.text());
    })();
  }, [file]);

  let contentBox = React.createRef();
  const saveText = () => {
        let element = contentBox.current;
        let firstTag = element.firstChild.nodeName;
        let keyTag = new RegExp(
        firstTag === '#text' ? '<br' : '</' + firstTag, 'i');

        let tmp = document.createElement('p');
        tmp.innerHTML = element.innerHTML
        .replace(/<[^>]+>/g, (m, i) => (keyTag.test(m) ? '{ß®}' : ''))
        .replace(/{ß®}$/, '');

        let textToWrite =  tmp.innerText.replace(/{ß®}/g, '\n');
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

  return (
      <div className={css.preview}>
        <div className={css.title}>
            <span><small>{path.basename(file.name)}</small></span>
        </div>
        <div className={css.content}
            ref={contentBox}
            suppressContentEditableWarning={true}
            onBlur={saveText}
            contentEditable="true">{value}</div>
      </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
