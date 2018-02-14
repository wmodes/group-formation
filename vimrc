set term=builtin_ansi

filetype plugin indent on

syntax on " enabled syntax highlighting
:set number " line numbers
:set ai " autoindent
:set tabstop=4 " sets tabs to 4 characters
:set shiftwidth=4
:set expandtab
:set softtabstop=4 " makes the spaces feel like real tabs
" CSS (tabs = 2, lines = 79)
autocmd FileType css set omnifunc=csscomplete#CompleteCSS
autocmd FileType css set sw=2
autocmd FileType css set ts=2
autocmd FileType css set sts=2
" JavaScript (tabs = 4, lines = 79)
autocmd FileType javascript set omnifunc=javascriptcomplete#CompleteJS
autocmd FileType javascript set sw=4
autocmd FileType javascript set ts=4
autocmd FileType javascript set sts=4
" autocmd FileType javascript set tw=79
 
autocmd FileType jade set omnifunc=jadecomplete#CompleteJade
autocmd FileType jade set sw=2
autocmd FileType jade set ts=2
autocmd FileType jade set sts=2
 
" Highlight current line only in insert mode
autocmd InsertLeave * set nocursorline
autocmd InsertEnter * set cursorline
 
" Makefiles require TAB instead of whitespace
autocmd FileType make setlocal noexpandtab
 
" Highlight cursor
highlight CursorLine ctermbg=8 cterm=NONE
