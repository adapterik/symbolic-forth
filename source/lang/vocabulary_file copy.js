/**
 * File vocabulary
 *
 * Inclues:
 *
 * LOAD_FILE
 *
 * Okay, rather paltry, but that is all we need now.
 **/
import * as std from 'std';
import * as os from 'os';

const openFiles = {};

function file_load_word({forth}) {
    return () => {
        const fileName = forth.pop_string();

        const result = std.loadFile(fileName);
        if (result === null) {
            forth.parameter_stack.push(forth.null_value());
        } else {
            forth.parameter_stack.push(forth.string_value(result));
        }
    }
}

const BUFFER_SIZE = 1024;

const FILE_STATUS_NEW = 1;
const FILE_STATUS_OPEN = 2;
const FILE_STATUS_COMPLETE = 3;
const FILE_STATUS_CLOSED = 4;
const FILE_STATUS_ERROR = 5;

class BufferedFile {
    constructor({flags, path}) {
        this.buffer = new ArrayBuffer(BUFFER_SIZE);
        this.bytes = new Uint8Array(this.buffer);
        this.file_pos = null;
        this.buffer_length = 0;
        this.fd = null;
        this.status =

        // const len = os.read(fd, buffer, 0, 1);
        // if (len === 0) {
            // return null;
        // }

        // openFile.pos += 1;
        // openFiles[fileKey] = openFile;
        // return bytes[0];
    }

    open() {
        this.fd = os.open(this.path, this.flags);
        this.status = FILE_STATUS_OPEN;
    }

    close() {
        os.close(this.fd);
        this.status = FILE_STATUS_CLOSED;
    }

    fill_buffer() {
        this.buffer_length = os.read(this.fd, this.buffer, 0, BUFFER_SIZE);

        if (len === 0) {
            this.status = FILE_STATUS_COMPLETE;
            return;
        }
    }

    read_char() {
        if (this.file_pos >= this.bytes.length) {
            this.fill_buffer();
        }
        if (this.status === FILE_STATUS_COMPLETE) {
            return null;
        }
        const char = this.bytes[this.file_pos];
        this.file_pos += 1;
        return String.fromCharCode(char);
    }

    read_bytes(size) {
        if (this.file_pos >= this.bytes.length) {
            this.fill_buffer();
        }
        // for now we do a char at a time, which won't be
        // too bad as we are buffered...
        const result = '';
        for (let i = 0; i < size; i += 1) {
           const char = this.read_char();
           if (char === null) {
               throw new Error(`requested bytes longer than file`);
           }
           result += char;
        }
        return result;
    }

    read_until() {
        if (this.file_pos >= this.bytes.length) {
            this.fill_buffer();
        }
        // for now we do a char at a time, which won't be
        // too bad as we are buffered...
        const result = '';
        for (let i = 0; i < size; i += 1) {
            const char = this.read_char();
            if (char === null) {
                throw new Error(`requested bytes longer than file`);
            }
            result += char;
        }
        return result;
    }

    char_is_whitespace(char) {
        return char <= 32;
    }

    read_word() {
        const wordInput = new Uint8Array(32);
        let wordLen = 0;
        let in_word = false;
        let char = null;

        for (char =  this.get_char(); char !== null; char = this.get_char()) {
            if (char_is_whitespace(char)) {
                if (in_word) {
                    break;
                }
                continue;
            }
            in_word = true;
            wordInput[wordLen] = char;
            wordLen += 1;
        }

        if (wordLen === 0) {
            return null;
        }

        const word = '';
        for (let i = 0; i < wordLen; i += 1) {
            word += String.fromCharCode(wordInput[i]);
        }
        return word;
    }

    read_until_code(codes_to_match) {
        let char = false;
        let result = '';
        let matched = false;
        for (;;) {
            char = this.get_char(fd);
            if (char === null) {
                break;
            }
            matched = codes_to_match.includes(char);
            if (matched) {
                break;
            }
            result += String.fromCharCode(char);
        }
        return [char === null ? 0 : char, result];
    }
}

/**
 * Opens the give file, puts the file handle on the stack
 * If the file does not exist or there is any problem opening it
 * null is put on the stack.
 **/
function file_open_word({forth}) {
    return () => {
        const filename = forth.pop_string();
        const flags = forth.pop_number();
        const fd = os.open(filename, flags);
        if (fd === null) {
            throw new Error(`cannot open file ${filename} with perms ${stringPerms}`);
            // forth.parameter_stack.push(forth.null_value());
            // return;
        }
        openFiles[`${fd}`] = {
            fd,

            pos: 0
        };
        forth.parameter_stack.push(forth.number_value(fd));
    }
}

/**
 * Closes the file given by the file handle
 * If the file was successfully closed, true is put on the stack,
 * otherwise false is.
 **/
function file_close_word({forth}) {
    return () => {
        const fd = forth.pop_number();
        const errno = os.close(fd);
        if (errno === 0) {
            forth.parameter_stack.push(forth.bool_value(true));
        } else {
            forth.parameter_stack.push(forth.bool_value(false));
        }
        // const fileKey = '' + value;
        // if (fileKey in openFiles) {
        //     delete openFiles[fileKey];
        //     function file_read_word({forth}) {
        //         return () => {
        //             const [type, fd] = forth.parameter_stack.pop();
        //
        //             const len = forth.pop_number();
        //
        //             const buffer = new ArrayBuffer(len);
        //             const textInput = new Uint8Array(buffer);
        //
        //             const read_count = os.read(fd, buffer, 0, len);
        //
        //             if (read_count < len) {
        //                 throw new Error('unexpcted end of file');
        //             }
        //
        //             let result = '';
        //             for (let i = 0; i < read_count; i += 1) {
        //                 // console.log('char', i, textInput[i], String.fromCharCode(textInput[i]));
        //                 result += String.fromCharCode(textInput[i]);
        //             }
        //
        //             forth.parameter_stack.push(forth.string_value(result));
        //         }
        //     }
        //
        // }
    }
}

function getChar(fd) {
    // TODO: wrap these in a fd object
    const fileKey = '' + fd;
    // const openFile = openFiles[fileKey];
    const buffer = new ArrayBuffer(1);
    const bytes = new Uint8Array(buffer);

    const len = os.read(fd, buffer, 0, 1);
    if (len === 0) {
        return null;
    }

    // openFile.pos += 1;
    // openFiles[fileKey] = openFile;
    return bytes[0];
}



/**
 * Given a file handle, gets the next word, skipping any whitespace
 * until the word.
 * If the word is found, it (a string) is put on the stack.
 * If there is no word found - i.e. all whitespace or empty file -
 * null is put on the stack.
 **/
function char_is_whitespace(char) {
    return char <= 32;
}

function file_get_word_word({forth}) {
    return () => {
        const fd = forth.pop_number();
        // const fileKey = '' + fd;
        // const openFile = openFiles[fileKey];

        // const buffer = new ArrayBuffer(1024);
        const buffer = new ArrayBuffer(1);
        const textInput = new Uint8Array(buffer);
        const wordInput = new Uint8Array(32);
        let wordLen = 0;

        let total_len = 0;

        let word = '';
        let in_word = false;
        let char = null;

        for (char =  getChar(fd); char !== null; char = getChar(fd)) {
            if (char_is_whitespace(char)) {
                if (in_word) {
                    break;
                }
                continue;
            }
            in_word = true;
            total_len += 1;
            wordInput[wordLen] = char;
            wordLen += 1;
        }


        if (wordLen === 0) {
            forth.parameter_stack.push(forth.null_value());
            return;
        }

        // openFiles[fileKey] = openFile;

        // let result = "";
        for (let i = 0; i < wordLen; i += 1) {
            const ch = String.fromCharCode(wordInput[i]);
            word += String.fromCharCode(wordInput[i]);
        }

        forth.parameter_stack.push(forth.string_value(word));
    }
}

function file_get_until_word({forth}) {
    return () => {
        const fd = forth.pop_number();
        const until_string = forth.pop_string();

        // const buffer = new ArrayBuffer(1);
        // const textInput = new Uint8Array(buffer);
        // const wordInput = new Uint8Array(32);
        let char = null;

        let result = '';
        for (char =  getChar(fd); char !== null; char = getChar(fd)) {
            const ch = String.fromCharCode(char);

            if (ch === until_string) {
               break;
            }

            result += ch;
        }


        if (result.length === 0) {
            forth.parameter_stack.push(forth.null_value());
            return;
        }

        forth.parameter_stack.push(forth.string_value(result));
    }
}

function file_read_word({forth}) {
    return () => {
        const fd = forth.pop_number();
        const len = forth.pop_number();

        const buffer = new ArrayBuffer(len);
        const textInput = new Uint8Array(buffer);

        const read_count = os.read(fd, buffer, 0, len);

        if (read_count < len) {
           throw new Error('unexpcted end of file');
        }

        let result = '';
        for (let i = 0; i < read_count; i += 1) {
            // console.log('char', i, textInput[i], String.fromCharCode(textInput[i]));
            result += String.fromCharCode(textInput[i]);
        }

        forth.parameter_stack.push(forth.string_value(result));
    }
}

function file_write_string_word({forth}) {
    return () => {
        const fd = forth.pop_number();
        const toPrint = forth.pop_string();

        const len = toPrint.length;

        const buffer = new ArrayBuffer(len);
        const textInput = new Uint8Array(buffer);

        for (let i = 0; i < len; i += 1) {
            textInput[i] = toPrint.charCodeAt(i);
        }

        os.write(fd, buffer, 0, len);
    }
}

function file_get_while_word({forth}) {
    return () => {
        const fd = forth.pop_number();
        const while_value = forth.pop_array();

        const whilingAway = while_value.map(([type, value]) => {
            if (type !== 'number') {
                throw new Error(`may only include number`);
            }
            return value;
        });

        let char = null;
        let result = '';
        for (;;) {
            const char = getChar(fd);
            if (!whilingAway.includes(char)) {
                break;
            }
            const ch = String.fromCharCode(char);
            result += ch;
        }

        forth.parameter_stack.push(forth.string_value(result));
    }
}
function file_get_until_code_word({forth}) {
    return () => {
        const fd = forth.pop_number();
        const until_array = forth.pop_array();

        const codes_to_match = until_array.map(([,value]) => {
            return value;
        });

        // const buffer = new ArrayBuffer(1);
        // const textInput = new Uint8Array(buffer);
        // const wordInput = new Uint8Array(32);
        let char = false;

        let result = '';
        let matched = false;
        for (;;) {
            char = getChar(fd);
            if (char === null) {
                break;
            }
        // for (char =  getChar(fd); char !== null; char = getChar(fd)) {
            matched = codes_to_match.includes(char);
            if (matched) {
                break;
            }
            const ch = String.fromCharCode(char);
            result += ch;
        }


        // if (result.length === 0 && char === null) {
        //     forth.parameter_stack.push(forth.string_value(result));
        //     // forth.parameter_stack.push(forth.null_value());
        //     forth.parameter_stack.push(forth.number_value(0));
        //     return;
        // }

        // we always return the string, even if empty.
        forth.parameter_stack.push(forth.string_value(result));

        // and we return the matching character, or 0 if end of file.
        forth.parameter_stack.push(forth.number_value(char === null ? 0 : char));

    }
}


function file_get_char_word({forth}) {
    return () => {
        const fd = forth.pop_number();

        const char = getChar(fd);
        if (char === null) {
            forth.parameter_stack.push(forth.null_value());
        } else {
            forth.parameter_stack.push(forth.number_value(char));
        }
    }
}

function file_get_line_word({forth}) {
    return () => {
        const fd = forth.pop_number();

        // const buffer = new ArrayBuffer(1024);
        const buffer = new ArrayBuffer(1);
        const textInput = new Uint8Array(buffer);
        const lineInput = new Uint8Array(1024);
        let lineLen = 0;

        let total_len = 0;

        let read_len;
        let line = '';

        let char = null;

        for (char =  getChar(fd); char !== null; char = getChar(fd)) {
            if (char === 10) {
                    break;
            }
            total_len += 1;
            lineInput[lineLen] = char;
            lineLen += 1;
        }

        // for (read_len =  os.read(fd, buffer, 0, 1); read_len === 1; read_len = os.read(fd, buffer, read_len, 1)) {
            // if (buffer[0] === 10) {
                // break;
            // }
            // total_len += 1;
            // lineInput[lineLen] = buffer[0];
            // lineLen += 1;
        // }

        let result = "";
        for (let i = 0; i < lineLen; i += 1) {
            line += String.fromCharCode(lineInput[i]);
        }

        forth.parameter_stack.push(forth.string_value(line));
    }
}

function file_size_word({forth}) {
    return () => {
    }
}

const FileVocabulary = (forth, options = {}) => {
    forth.add_vocabulary('FILE', 'Work with the local filesystem (QuickJS only)');

    forth.add_constant('file', 'RDONLY', forth.number_value(os.O_RDONLY));
    forth.add_constant('file', 'WRONLY', forth.number_value(os.O_WRONLY));
    forth.add_constant('file', 'RDWR', forth.number_value(os.O_RDWR));
    forth.add_constant('file', 'APPEND', forth.number_value(os.O_APPEND));
    forth.add_constant('file', 'CREAT', forth.number_value(os.O_CREAT));
    forth.add_constant('file', 'EXCL', forth.number_value(os.O_EXCL));
    forth.add_constant('file', 'TRUNC', forth.number_value(os.O_TRUNC));

    forth.add_word('file', "load", file_load_word);
    forth.add_word('file', "open", file_open_word);
    forth.add_word('file', "close", file_close_word);
    forth.add_word('file', "read", file_read_word);
    forth.add_word('file', "get-word", file_get_word_word);
    forth.add_word('file', "get-until", file_get_until_word);
    forth.add_word('file', "get-while-code", file_get_while_word);
    forth.add_word('file', "get-until-code", file_get_until_code_word);
    forth.add_word('file', "get-char", file_get_char_word);
    forth.add_word('file', "get-line", file_get_line_word);
    forth.add_word('file', 'write-string', file_write_string_word);

    // forth.add_word('file', "size", file_size_word);

};

export default FileVocabulary;
