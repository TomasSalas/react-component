import React, { forwardRef, useRef, useState, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  ChevronDown,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Type
} from 'lucide-react'
import { useId } from '../hooks/useId'

const variants = {
  primary: {
    active: 'rui:bg-[var(--primary-bg)] rui:text-white',
    hover: 'rui:hover:bg-[var(--primary-hover)] rui:hover:text-white',
    border: 'rui:border-[var(--primary-border)]',
    focus: 'rui:ring-[var(--primary-focus)]'
  },
  success: {
    active: 'rui:bg-[var(--success-bg)] rui:text-white',
    hover: 'rui:hover:bg-[var(--success-hover)] rui:hover:text-white',
    border: 'rui:border-[var(--success-border)]',
    focus: 'rui:ring-[var(--success-focus)]'
  },
  error: {
    active: 'rui:bg-[var(--error-bg)] rui:text-white',
    hover: 'rui:hover:bg-[var(--error-hover)] rui:hover:text-white',
    border: 'rui:border-[var(--error-border)]',
    focus: 'rui:ring-[var(--error-focus)]'
  },
  warning: {
    active: 'rui:bg-[var(--warning-bg)] rui:text-white',
    hover: 'rui:hover:bg-[var(--warning-hover)] rui:hover:text-white',
    border: 'rui:border-[var(--warning-border)]',
    focus: 'rui:ring-[var(--warning-focus)]'
  },
  ghost: {
    active: 'rui:bg-[var(--ghost-active)] rui:text-[var(--ghost-text)] rui:border-[var(--ghost-border)]',
    hover: 'rui:hover:bg-[var(--ghost-hover)] rui:hover:text-white',
    border: 'rui:border-[var(--ghost-border)]',
    focus: 'rui:ring-[var(--ghost-focus)]'
  },
  link: {
    active: 'rui:underline rui:text-[var(--link-text)]',
    hover: 'rui:hover:underline rui:hover:text-white',
    border: 'rui:border-transparent',
    focus: 'rui:ring-transparent'
  }
}

const InputRichText = forwardRef((props, ref) => {
  const {
    fullWidth = false,
    className = '',
    label = '',
    errorMessage = '',
    placeholder = 'Escribe aquí...',
    onChange,
    value = '',
    minHeight = '200px',
    maxHeight = '400px',
    variant = 'primary',
    disabled = false,
    ...rest
  } = props

  const id = useId()
  const errorId = `${id}-error`
  const toolbarRef = useRef(null)
  const editorRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showListMenu, setShowListMenu] = useState(false)
  const [showFormatMenu, setShowFormatMenu] = useState(false)
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)

  useEffect(() => {
    const anyMenuOpen = showListMenu || showFormatMenu || showHighlightMenu
    if (!anyMenuOpen) return

    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setShowListMenu(false)
        setShowFormatMenu(false)
        setShowHighlightMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showListMenu, showFormatMenu, showHighlightMenu])
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [consecutiveEnters, setConsecutiveEnters] = useState(0)

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
    code: false,
    h2: false,
    h3: false,
    blockquote: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false
  })

  const checkActiveStyles = useCallback(() => {
    if (!editorRef.current || !document.queryCommandSupported) return
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    const node = selection.focusNode
    const parentElement = node?.parentElement
    let currentBlock = parentElement
    while (currentBlock && !['H2', 'H3', 'P', 'PRE', 'BLOCKQUOTE', 'LI', 'DIV'].includes(currentBlock.tagName)) {
      currentBlock = currentBlock.parentElement
    }
    const isCode = currentBlock?.tagName === 'PRE'
    const isH2 = currentBlock?.tagName === 'H2'
    const isH3 = currentBlock?.tagName === 'H3'
    const isBlockquote = currentBlock?.tagName === 'BLOCKQUOTE'
    const isListItem = currentBlock?.tagName === 'LI'
    let textAlign = 'left'
    if (currentBlock) {
      if (currentBlock.style.textAlign) {
        textAlign = currentBlock.style.textAlign
      } else if (currentBlock.getAttribute('align')) {
        textAlign = currentBlock.getAttribute('align')
      } else if (currentBlock.parentElement?.style.textAlign) {
        textAlign = currentBlock.parentElement.style.textAlign
      }
    }
    setActiveStyles((prev) => ({
      ...prev,
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      ul: isListItem && currentBlock?.parentElement?.tagName === 'UL',
      ol: isListItem && currentBlock?.parentElement?.tagName === 'OL',
      code: isCode,
      h2: isH2,
      h3: isH3,
      blockquote: isBlockquote,
      alignLeft: textAlign === 'left',
      alignCenter: textAlign === 'center',
      alignRight: textAlign === 'right'
    }))
  }, [])

  const saveToHistory = useCallback((content) => {
    setUndoStack((prev) => {
      const newStack = [...prev.slice(0, historyIndex + 1), content]
      setHistoryIndex(newStack.length - 1)
      return newStack.slice(-50)
    })
  }, [historyIndex])

  const handleInput = () => {
    if (!editorRef.current) return
    const content = editorRef.current.innerHTML
    if (content !== undoStack[historyIndex]) {
      saveToHistory(content)
      setRedoStack([])
    }
    if (onChange) onChange(content)
  }

  const execCommand = (command, value = null) => {
    if (!editorRef.current || disabled) return
    try {
      switch (command) {
        case 'formatBlock':
          document.execCommand('formatBlock', false, value)
          break
        case 'heading2':
          if (document.queryCommandValue('formatBlock') === 'h2') {
            document.execCommand('formatBlock', false, 'p')
          } else {
            document.execCommand('formatBlock', false, 'h2')
          }
          break
        case 'heading3':
          if (document.queryCommandValue('formatBlock') === 'h3') {
            document.execCommand('formatBlock', false, 'p')
          } else {
            document.execCommand('formatBlock', false, 'h3')
          }
          break
        case 'code':
          // eslint-disable-next-line no-case-declarations
          const isCode = document.queryCommandValue('formatBlock') === 'pre'
          document.execCommand('formatBlock', false, isCode ? 'p' : 'pre')
          break
        case 'blockquote':
          if (document.queryCommandValue('formatBlock') === 'blockquote') {
            document.execCommand('formatBlock', false, 'p')
          } else {
            document.execCommand('formatBlock', false, 'blockquote')
          }
          break
        case 'textAlign':
          document.execCommand('styleWithCSS', false, true)
          // eslint-disable-next-line no-case-declarations
          const selection = window.getSelection()
          if (selection.rangeCount) {
            const range = selection.getRangeAt(0)
            const parentElement = range.commonAncestorContainer.parentElement
            let currentBlock = parentElement
            while (currentBlock && !['H2', 'H3', 'P', 'DIV', 'BLOCKQUOTE', 'PRE'].includes(currentBlock.tagName)) {
              currentBlock = currentBlock.parentElement
            }
            if (currentBlock) {
              currentBlock.style.textAlign = value.toLowerCase()
            }
          }
          break
        case 'highlight':
          document.execCommand('styleWithCSS', false, true)
          document.execCommand('hiliteColor', false, value)
          break
        default:
          document.execCommand(command, false, value)
      }
      saveToHistory(editorRef.current.innerHTML)
    } catch (error) {
      console.error('Error executing command:', error)
    }
    editorRef.current?.focus()
    setTimeout(checkActiveStyles, 0)
    setShowListMenu(false)
    setShowFormatMenu(false)
    setShowHighlightMenu(false)
  }

  const handleKeyDown = (e) => {
    if (!editorRef.current) return
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    const range = selection.getRangeAt(0)
    let parentElement = range.commonAncestorContainer
    if (parentElement.nodeType !== 1) {
      parentElement = parentElement.parentElement
    }
    if (e.key === 'Tab') {
      const isInCodeBlock = parentElement.closest('pre') || parentElement.tagName === 'PRE'
      if (isInCodeBlock) {
        e.preventDefault()
        document.execCommand('insertText', false, '    ')
        handleInput()
        return
      }
      e.preventDefault()
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
      handleInput()
      return
    }
    if (e.key === 'Enter') {
      const isInCodeBlock = parentElement.closest('pre') || parentElement.tagName === 'PRE'
      const isInHeading = parentElement.closest('h2, h3') || ['H2', 'H3'].includes(parentElement.tagName)
      const isInBlockquote = parentElement.closest('blockquote') || parentElement.tagName === 'BLOCKQUOTE'
      if (isInCodeBlock || isInHeading || isInBlockquote) {
        setConsecutiveEnters((prev) => prev + 1)
        if (consecutiveEnters >= 1) {
          e.preventDefault()
          const currentBlock = parentElement.closest('pre, h2, h3, blockquote') || parentElement
          const p = document.createElement('p')
          p.innerHTML = '<br>'
          currentBlock.parentNode.insertBefore(p, currentBlock.nextSibling)
          const newRange = document.createRange()
          newRange.setStart(p, 0)
          newRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(newRange)
          setConsecutiveEnters(0)
          handleInput()
          checkActiveStyles()
          return
        }
        if (isInCodeBlock) {
          e.preventDefault()
          const node = selection.focusNode
          const offset = selection.focusOffset
          if (node.nodeType === 3) {
            const text = node.textContent
            const beforeCursor = text.substring(0, offset)
            const afterCursor = text.substring(offset)
            const lines = beforeCursor.split('\n')
            const currentLine = lines[lines.length - 1]
            const indentMatch = currentLine.match(/^(\s*)/)
            const indent = indentMatch ? indentMatch[1] : ''
            const newText = beforeCursor + '\n' + indent + afterCursor
            node.textContent = newText
            const newOffset = offset + 1 + indent.length
            const newRange = document.createRange()
            newRange.setStart(node, newOffset)
            newRange.collapse(true)
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
          handleInput()
          return
        }
      } else {
        setConsecutiveEnters(0)
      }
      const isInList = parentElement.closest('ul, ol')
      if (isInList && selection.toString() === '' && parentElement.textContent === '') {
        e.preventDefault()
        document.execCommand('outdent')
        handleInput()
      }
    } else {
      setConsecutiveEnters(0)
    }
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); execCommand('bold'); break
        case 'i': e.preventDefault(); execCommand('italic'); break
        case 'u': e.preventDefault(); execCommand('underline'); break
        case 'z': e.preventDefault(); if (e.shiftKey) redo(); else undo(); break
        case 'y': e.preventDefault(); redo(); break
        case '`': e.preventDefault(); execCommand('code'); break
      }
    }
    if (e.key === 'Backspace' && parentElement.textContent === '') {
      const tagName = parentElement.tagName.toLowerCase()
      if (['h2', 'h3', 'blockquote', 'pre'].includes(tagName)) {
        e.preventDefault()
        document.execCommand('formatBlock', false, 'p')
        handleInput()
      }
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setRedoStack([undoStack[historyIndex], ...redoStack])
      if (editorRef.current) {
        editorRef.current.innerHTML = undoStack[newIndex]
        if (onChange) onChange(undoStack[newIndex])
      }
    }
  }

  const redo = () => {
    if (redoStack.length > 0) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const [firstRedo, ...restRedo] = redoStack
      setRedoStack(restRedo)
      if (editorRef.current) {
        editorRef.current.innerHTML = firstRedo
        if (onChange) onChange(firstRedo)
      }
    }
  }

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || ''
      saveToHistory(value || '')
    }
  }, [value])

  const variantClasses = variants[variant] || variants.primary

  const inputClasses = clsx(
    'rui:bg-white rui:border rui:text-gray-900',
    'rui:block rui:w-full rui:transition-[border-color,box-shadow] rui:duration-150 rui:focus:outline-none rui:p-4 rui:overflow-y-auto',
    'rui:min-h-[var(--min-height)] rui:max-h-[var(--max-height)]',
    '[&_ul]:rui:list-disc [&_ul]:rui:ml-8 [&_ol]:rui:list-decimal [&_ol]:rui:ml-8',
    '[&_h2]:rui:text-2xl [&_h2]:rui:font-bold [&_h2]:rui:my-4',
    '[&_h3]:rui:text-xl [&_h3]:rui:font-bold [&_h3]:rui:my-3',
    '[&_blockquote]:rui:border-l-4 [&_blockquote]:rui:border-gray-300 [&_blockquote]:rui:pl-4 [&_blockquote]:rui:my-4 [&_blockquote]:rui:text-gray-600',
    '[&_pre]:rui:bg-gray-50 [&_pre]:rui:text-gray-800 [&_pre]:rui:border [&_pre]:rui:border-gray-200 [&_pre]:rui:p-4 [&_pre]:rui:rounded [&_pre]:rui:font-mono [&_pre]:rui:my-3',
    '[&_pre]:rui:text-sm [&_pre]:rui:leading-relaxed [&_pre]:rui:whitespace-pre [&_pre]:rui:overflow-x-auto',
    '[&_pre_code]:rui:block [&_pre_code]:rui:w-full',
    '[&_img]:rui:max-w-full [&_img]:rui:h-auto [&_img]:rui:my-3 [&_img]:rui:rounded',
    '[&_a]:rui:text-blue-600 [&_a]:rui:underline [&_a]:rui:hover:text-blue-800',
    {
      [`rui:ring-0 ${variantClasses.focus} rui:border-gray-300`]: isFocused && !errorMessage,
      'rui:border-(--error-border)': !!errorMessage,
      [`rui:ring-1 ${variants.error.focus}`]: isFocused && !!errorMessage,
      'rui:border-gray-300': !errorMessage,
      'rui:w-full': fullWidth
    }
  )

  const highlightColors = [
    { name: 'Amarillo', value: '#ffeb3b' },
    { name: 'Verde', value: '#c8e6c9' },
    { name: 'Azul', value: '#bbdefb' },
    { name: 'Rosa', value: '#f8bbd0' },
    { name: 'Naranja', value: '#ffe0b2' },
    { name: 'Sin destacar', value: 'transparent' }
  ]

  return (
    <div className={clsx(className, { 'rui:w-full': fullWidth })}>
      {label && <label htmlFor={id} className='rui:block rui:mb-2 rui:text-sm rui:font-semibold rui:text-gray-700'>{label}</label>}

      <div
        ref={toolbarRef}
        aria-disabled={disabled}
        className={clsx(
          'rui:flex rui:flex-wrap rui:items-center rui:gap-1 rui:p-2 rui:bg-gray-50 rui:border rui:border-b-0 rui:border-gray-300 rui:rounded-t-lg rui:select-none',
          { 'rui:opacity-50 rui:pointer-events-none': disabled }
        )}
      >
        <ToolbarButton onClick={undo} disabled={historyIndex <= 0} title='Deshacer (Ctrl+Z)' variant={variant}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={redo} disabled={redoStack.length === 0} title='Rehacer (Ctrl+Y)' variant={variant}>
          <Redo size={16} />
        </ToolbarButton>

        <div className='rui:h-6 rui:w-px rui:bg-gray-300 rui:mx-1' />

        <ToolbarButton active={activeStyles.bold} onClick={() => execCommand('bold')} title='Negrita (Ctrl+B)' variant={variant}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton active={activeStyles.italic} onClick={() => execCommand('italic')} title='Cursiva (Ctrl+I)' variant={variant}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton active={activeStyles.underline} onClick={() => execCommand('underline')} title='Subrayado (Ctrl+U)' variant={variant}>
          <Underline size={16} />
        </ToolbarButton>

        <div className='rui:relative'>
          <ToolbarButton onClick={() => setShowHighlightMenu(!showHighlightMenu)} title='Resaltar' variant={variant}>
            <Highlighter size={16} />
          </ToolbarButton>
          {showHighlightMenu && (
            <div className='rui:absolute rui:top-full rui:left-0 rui:mt-1 rui:w-44 rui:bg-white rui:border rui:border-gray-200 rui:shadow-xl rui:rounded-md rui:z-50 rui:py-1'>
              {highlightColors.map((color) => (
                <button
                  key={color.value}
                  type='button'
                  className='rui:w-full rui:flex rui:items-center rui:gap-2 rui:px-3 rui:py-2 rui:text-sm rui:hover:bg-gray-100 rui:text-gray-700'
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => execCommand('highlight', color.value)}
                >
                  <span className='rui:w-5 rui:h-5 rui:rounded rui:border rui:border-gray-300' style={{ backgroundColor: color.value }} />
                  {color.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='rui:h-6 rui:w-px rui:bg-gray-300 rui:mx-1' />

        <div className='rui:relative'>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowFormatMenu(!showFormatMenu)}
            className={clsx(
              'rui:flex rui:items-center rui:gap-0.5 rui:p-1.5 rui:rounded rui:transition-colors',
              activeStyles.h2 || activeStyles.h3 || activeStyles.code || activeStyles.blockquote
                ? `${variantClasses.active}`
                : `rui:text-gray-600 ${variantClasses.hover}`
            )}
            title='Formato'
          >
            <Type size={16} />
            <ChevronDown size={12} />
          </button>
          {showFormatMenu && (
            <div className='rui:absolute rui:top-full rui:left-0 rui:mt-1 rui:w-48 rui:bg-white rui:border rui:border-gray-200 rui:shadow-xl rui:rounded-md rui:z-50 rui:py-1'>
              <button type='button' className='rui:w-full rui:flex rui:items-center rui:gap-2 rui:px-3 rui:py-2 rui:text-sm rui:hover:bg-gray-100 rui:text-gray-700' onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('heading2')}>
                <Heading2 size={14} /> Título 2
              </button>
              <button type='button' className='rui:w-full rui:flex rui:items-center rui:gap-2 rui:px-3 rui:py-2 rui:text-sm rui:hover:bg-gray-100 rui:text-gray-700' onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('heading3')}>
                <Heading3 size={14} /> Título 3
              </button>
              <button type='button' className='rui:w-full rui:flex rui:items-center rui:gap-2 rui:px-3 rui:py-2 rui:text-sm rui:hover:bg-gray-100 rui:text-gray-700' onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('code')}>
                <Code size={14} /> Código (Ctrl+`)
              </button>
              <button type='button' className='rui:w-full rui:flex rui:items-center rui:gap-2 rui:px-3 rui:py-2 rui:text-sm rui:hover:bg-gray-100 rui:text-gray-700' onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('blockquote')}>
                <Quote size={14} /> Cita
              </button>
            </div>
          )}
        </div>

        <div className='rui:relative'>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowListMenu(!showListMenu)}
            className={clsx(
              'rui:flex rui:items-center rui:gap-0.5 rui:p-1.5 rui:rounded rui:transition-colors',
              activeStyles.ul || activeStyles.ol ? `${variantClasses.active}` : `rui:text-gray-600 ${variantClasses.hover}`
            )}
          >
            <List size={16} />
            <ChevronDown size={12} />
          </button>
          {showListMenu && (
            <div className='rui:absolute rui:top-full rui:left-0 rui:mt-1 rui:w-48 rui:bg-white rui:border rui:border-gray-200 rui:shadow-xl rui:rounded-md rui:z-50 rui:py-1'>
              <button type='button' className='rui:w-full rui:flex rui:items-center rui:gap-2 rui:px-3 rui:py-2 rui:text-sm rui:hover:bg-gray-100 rui:text-gray-700' onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('insertUnorderedList')}>
                <List size={14} /> Lista con viñetas
              </button>
              <button type='button' className='rui:w-full rui:flex rui:items-center rui:gap-2 rui:px-3 rui:py-2 rui:text-sm rui:hover:bg-gray-100 rui:text-gray-700' onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('insertOrderedList')}>
                <ListOrdered size={14} /> Lista numerada
              </button>
            </div>
          )}
        </div>

        <div className='rui:h-6 rui:w-px rui:bg-gray-300 rui:mx-1' />
        <ToolbarButton active={activeStyles.alignLeft} onClick={() => execCommand('textAlign', 'Left')} title='Alinear izquierda' variant={variant}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton active={activeStyles.alignCenter} onClick={() => execCommand('textAlign', 'Center')} title='Alinear centro' variant={variant}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton active={activeStyles.alignRight} onClick={() => execCommand('textAlign', 'Right')} title='Alinear derecha' variant={variant}>
          <AlignRight size={16} />
        </ToolbarButton>
      </div>

      <div
        ref={(node) => {
          editorRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        id={id}
        contentEditable={!disabled}
        role='textbox'
        aria-multiline='true'
        aria-label={!label ? placeholder : undefined}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-disabled={disabled}
        className={clsx(inputClasses, { 'rui:opacity-50 rui:cursor-not-allowed rui:bg-gray-50': disabled })}
        style={{
          '--min-height': minHeight,
          '--max-height': maxHeight
        }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyUp={checkActiveStyles}
        onMouseUp={checkActiveStyles}
        onClick={checkActiveStyles}
        spellCheck
        data-placeholder={placeholder}
        {...rest}
      />

      <p id={errorId} className='rui:text-(--error-text) rui:text-xs rui:mt-1.5 rui:ml-1 rui:font-medium rui:h-4'>{errorMessage}</p>
    </div>
  )
})

const ToolbarButton = ({ active, onClick, children, title, disabled = false, variant = 'primary' }) => {
  const variantClasses = variants[variant] || variants.primary
  return (
    <button
      type='button'
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault()
        if (!disabled) onClick()
      }}
      className={clsx(
        'rui:p-1.5 rui:transition-colors rui:duration-150 rui:rounded rui:flex rui:items-center rui:justify-center',
        active
          ? `${variantClasses.active} rui:shadow-inner`
          : disabled
            ? 'rui:text-gray-400 rui:cursor-not-allowed'
            : `rui:text-gray-600 ${variantClasses.hover}`
      )}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  )
}

InputRichText.displayName = 'InputRichText'
export default InputRichText
