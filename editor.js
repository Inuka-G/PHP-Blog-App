
import { Editor } from 'https://esm.sh/@tiptap/core@2.6.6';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.6.6';
import Highlight from 'https://esm.sh/@tiptap/extension-highlight@2.6.6';
import Underline from 'https://esm.sh/@tiptap/extension-underline@2.6.6';
import Link from 'https://esm.sh/@tiptap/extension-link@2.6.6';
import TextAlign from 'https://esm.sh/@tiptap/extension-text-align@2.6.6';
import Image from 'https://esm.sh/@tiptap/extension-image@2.6.6';
import YouTube from 'https://esm.sh/@tiptap/extension-youtube@2.6.6';
import TextStyle from 'https://esm.sh/@tiptap/extension-text-style@2.6.6';
import FontFamily from 'https://esm.sh/@tiptap/extension-font-family@2.6.6';
import { Color } from 'https://esm.sh/@tiptap/extension-color@2.6.6';
import Bold from 'https://esm.sh/@tiptap/extension-bold@2.6.6'; // Import the Bold extension


window.addEventListener('load', async function () {
    if (document.getElementById("wysiwyg-example")) {

        const FontSizeTextStyle = TextStyle.extend({
            addAttributes() {
                return {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return { style: 'font-size: ' + attributes.fontSize };
                        },
                    },
                };
            },
        });
        const CustomBold = Bold.extend({
            // Override the renderHTML method
            renderHTML({ mark, HTMLAttributes }) {
                const { style, ...rest } = HTMLAttributes;

                // Merge existing styles with font-weight
                const newStyle = 'font-weight: bold;' + (style ? ' ' + style : '');

                return ['span', { ...rest, style: newStyle.trim() }, 0];
            },
            // Ensure it doesn't exclude other marks
            addOptions() {
                return {
                    ...this.parent?.(),
                    HTMLAttributes: {},
                };
            },
        });
        // helper to load blog content (if editing). Returns the content string.
        async function loadContent() {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (!id) return '';

            const base = (typeof API_BASE !== 'undefined') ? API_BASE : '/phpblog/api';

            if (document.getElementById('formTitle')) {
                document.getElementById('formTitle').textContent = 'Edit Blog Post';
            }

            try {
                const resp = await fetch(`${base}/blog/read.php?id=${encodeURIComponent(id)}`);
                if (!resp.ok) throw new Error(`Failed to load post (${resp.status})`);
                const blog = await resp.json();

                if (document.getElementById('title')) document.getElementById('title').value = blog.title || '';
                if (document.getElementById('image_url')) document.getElementById('image_url').value = blog.image_url || blog.postimg || '';

                // If content is stored as Markdown, convert to HTML using marked (if available)
                let raw = blog.content || '';
                let parsed = raw;
                if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
                    parsed = marked.parse(raw);
                }
                // sanitize HTML
                if (typeof DOMPurify !== 'undefined' && typeof DOMPurify.sanitize === 'function') {
                    parsed = DOMPurify.sanitize(parsed);
                }

                return parsed;
            } catch (error) {
                console.error('Error loading blog:', error);
                const alert = document.getElementsByClassName("alert")[0];
                if (alert) {
                    alert.style.display = "block";
                    alert.innerHTML = `Error: ${error.message}`;
                }
                return '';
            }
        }

        // Load content (if any) before creating the editor so initial content is correct
        const initialContent = await loadContent();
        const editor = new Editor({
            element: document.querySelector('#wysiwyg-example'),
            extensions: [
                StarterKit.configure({
                    textStyle: false,
                    bold: false,
                    marks: {
                        bold: false,
                    },
                }),
                // Include the custom Bold extension
                CustomBold,
                TextStyle,
                Color,
                FontSizeTextStyle,
                FontFamily,
                Highlight,
                Underline,
                Link.configure({
                    openOnClick: false,
                    autolink: true,
                    defaultProtocol: 'https',
                }),
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                Image,
                YouTube,
            ],
            content: initialContent,
            editorProps: {
                attributes: {
                    class: 'format lg:format-lg dark:format-invert focus:outline-none format-blue max-w-none',
                },
            }
        });

        // expose the editor so other scripts (app.js) can read content on submit
        window.tiptapEditor = editor;

        // set up custom event listeners for the buttons
        document.getElementById('toggleBoldButton').addEventListener('click', () => editor.chain().focus().toggleBold().run());
        document.getElementById('toggleItalicButton').addEventListener('click', () => editor.chain().focus().toggleItalic().run());
        document.getElementById('toggleUnderlineButton').addEventListener('click', () => editor.chain().focus().toggleUnderline().run());
        document.getElementById('toggleStrikeButton').addEventListener('click', () => editor.chain().focus().toggleStrike().run());
        document.getElementById('toggleHighlightButton').addEventListener('click', () => {
            const isHighlighted = editor.isActive('highlight');
            // when using toggleHighlight(), judge if is is already highlighted.
            editor.chain().focus().toggleHighlight({
                color: isHighlighted ? undefined : '#ffc078' // if is already highlighted，unset the highlight color
            }).run();
        });

        document.getElementById('toggleLinkButton').addEventListener('click', () => {
            const url = window.prompt('Enter image URL:', 'https://flowbite.com');
            editor.chain().focus().toggleLink({ href: url }).run();
        });
        document.getElementById('removeLinkButton').addEventListener('click', () => {
            editor.chain().focus().unsetLink().run()
        });
        document.getElementById('toggleCodeButton').addEventListener('click', () => {
            editor.chain().focus().toggleCode().run();
        })

        document.getElementById('toggleLeftAlignButton').addEventListener('click', () => {
            editor.chain().focus().setTextAlign('left').run();
        });
        document.getElementById('toggleCenterAlignButton').addEventListener('click', () => {
            editor.chain().focus().setTextAlign('center').run();
        });
        document.getElementById('toggleRightAlignButton').addEventListener('click', () => {
            editor.chain().focus().setTextAlign('right').run();
        });
        document.getElementById('toggleListButton').addEventListener('click', () => {
            editor.chain().focus().toggleBulletList().run();
        });
        document.getElementById('toggleOrderedListButton').addEventListener('click', () => {
            editor.chain().focus().toggleOrderedList().run();
        });
        document.getElementById('toggleBlockquoteButton').addEventListener('click', () => {
            editor.chain().focus().toggleBlockquote().run();
        });
        document.getElementById('toggleHRButton').addEventListener('click', () => {
            editor.chain().focus().setHorizontalRule().run();
        });
        document.getElementById('addImageButton').addEventListener('click', () => {
            const url = window.prompt('Enter image URL:', 'https://placehold.co/600x400');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        });
        document.getElementById('addVideoButton').addEventListener('click', () => {
            const url = window.prompt('Enter YouTube URL:', 'https://www.youtube.com/watch?v=KaLxCiilHns');
            if (url) {
                editor.commands.setYoutubeVideo({
                    src: url,
                    width: 640,
                    height: 480,
                })
            }
        });

        // typography dropdown
        const typographyDropdown = FlowbiteInstances.getInstance('Dropdown', 'typographyDropdown');

        document.getElementById('toggleParagraphButton').addEventListener('click', () => {
            editor.chain().focus().setParagraph().run();
            typographyDropdown.hide();
        });

        document.querySelectorAll('[data-heading-level]').forEach((button) => {
            button.addEventListener('click', () => {
                const level = button.getAttribute('data-heading-level');
                editor.chain().focus().toggleHeading({ level: parseInt(level) }).run()
                typographyDropdown.hide();
            });
        });

        const textSizeDropdown = FlowbiteInstances.getInstance('Dropdown', 'textSizeDropdown');

        // Loop through all elements with the data-text-size attribute
        document.querySelectorAll('[data-text-size]').forEach((button) => {
            button.addEventListener('click', () => {
                const fontSize = button.getAttribute('data-text-size');

                // Apply the selected font size via pixels using the TipTap editor chain
                editor.chain().focus().setMark('textStyle', { fontSize }).run();

                // Hide the dropdown after selection
                textSizeDropdown.hide();
            });
        });

        // Listen for color picker changes
        const colorPicker = document.getElementById('color');
        colorPicker.addEventListener('input', (event) => {
            const selectedColor = event.target.value;

            // Apply the selected color to the selected text
            editor.chain().focus().setColor(selectedColor).run();
        })

        document.querySelectorAll('[data-hex-color]').forEach((button) => {
            button.addEventListener('click', () => {
                const selectedColor = button.getAttribute('data-hex-color');

                // Apply the selected color to the selected text
                editor.chain().focus().setColor(selectedColor).run();
            });
        });

        document.getElementById('reset-color').addEventListener('click', () => {
            editor.commands.unsetColor();
        })

        const fontFamilyDropdown = FlowbiteInstances.getInstance('Dropdown', 'fontFamilyDropdown');

        // Loop through all elements with the data-font-family attribute
        document.querySelectorAll('[data-font-family]').forEach((button) => {
            button.addEventListener('click', () => {
                const fontFamily = button.getAttribute('data-font-family');

                // Apply the selected font size via pixels using the TipTap editor chain
                editor.chain().focus().setFontFamily(fontFamily).run();

                // Hide the dropdown after selection
                fontFamilyDropdown.hide();
            });
        });
    }
})
