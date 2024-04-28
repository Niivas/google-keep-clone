class app{
    constructor(){
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.title = '';
        this.text = '';
        this.id = '';
        this.$form = document.querySelector('#form');
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector('#note-text');
        this.$formButtons = document.querySelector('#form-buttons');
        this.$formCloseButton = document.querySelector('#form-close-button');
        this.$placeholder = document.querySelector('#placeholder');
        this.$notes = document.querySelector('#notes');
        this.$modal = document.querySelector('.modal');
        this.$modalSaveButton = document.querySelector('.modal-save-button');
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$modalTitle = document.querySelector('.modal-title');
        this.$modalText = document.querySelector('.modal-text');
        this.addEventListeners();
    }

    addEventListeners(){
        document.body.addEventListener('click', event =>{
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
        });
        
        this.$formCloseButton.addEventListener('click', event =>{
            event.stopPropagation(); // prevent the event from bubbling up
            this.closeForm();
            this.$noteTitle.value = '';
            this.$noteText.value = '';
        });

        this.$form.addEventListener('submit', event =>{
            event.preventDefault(); // prevent the default behavior of the form
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;

            if(title || text){
                this.addNote({
                    title,
                    text
                });
            }
        });

        this.$modalCloseButton.addEventListener('click', event =>{
            this.$modal.classList.toggle('open-modal');
        });

        this.$modalSaveButton.addEventListener('click', event =>{
            const title = this.$modalTitle.value;
            const text = this.$modalText.value;
            this.editNote(title, text);
        });
    };

    handleFormClick(event){
        const isFormClicked = this.$form.contains(event.target);

        if(isFormClicked){
            this.openForm();
        }else{
            this.closeForm();
        }
    }

    openForm(){
        this.$form.classList.add('form-open');
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }
    
    closeForm() {
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
    }

    addNote(note){
        const newNote = {
            title: note.title,
            text: note.text,
            color: note.color || 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        };

        this.notes = [...this.notes, newNote];
        this.displayNotes();
        this.closeForm();
        this.$noteTitle.value = '';
        this.$noteText.value = '';
    }

    editNote (title, text){
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? {...note, title, text} : note
        );
        this.displayNotes();
        this.$modalTitle.value = '';
        this.$modalText.value = '';
        this.$modal.classList.toggle('open-modal');
    }

    displayNotes(){
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color};" class="note" data-id = ${note.id}>
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <img class="toolbar-color" src="https://icon.now.sh/palette">
                        <img class="toolbar-delete" src="https://icon.now.sh/delete">
                    </div>
                </div>
            </div>
        `).join("");
    }

    openModal(event){
        if (event.target.closest('.note')){
            this.$modal.classList.toggle('open-modal');
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    selectNote(event){
        const $selectedNote = event.target.closest('.note');
        if($selectedNote){
            const [$title, $text] = $selectedNote.children;
            this.title = $title.innerText;
            this.text = $text.innerText;
            this.id = $selectedNote.dataset.id;
        }
    }
}

new app();


module.exports = app;