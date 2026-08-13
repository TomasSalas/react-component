import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'
import clsx from 'clsx'
import { useId } from '../hooks/useId.js'

const FileUpload = forwardRef((props, ref) => {
  const {
    label = '',
    onFilesSelect,
    multiple = false,
    accept = '',
    className = '',
    variant = 'primary',
    disabled = false,
    errorMessage = '',
    ...rest
  } = props

  const [selectedFiles, setSelectedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [internalError, setInternalError] = useState('')
  const inputRef = useRef(null)
  const id = useId()
  const errorId = `${id}-error`

  const variants = {
    primary: {
      border: 'rui:border-gray-300',
      hoverBorder: 'rui:border-(--primary-border)',
      disabled: 'rui:bg-gray-100 rui:border-gray-200 rui:text-gray-400 rui:cursor-not-allowed',
      focus: 'rui:ring-2 rui:ring-(--primary-focus)',
      focusVisible: 'rui:focus-visible:ring-2 rui:focus-visible:ring-(--primary-focus)',
      iconFocusColor: 'rui:text-(--primary-focus)'
    },
    success: {
      border: 'rui:border-gray-300',
      hoverBorder: 'rui:border-(--success-border)',
      disabled: 'rui:bg-gray-100 rui:border-gray-200 rui:text-gray-400 rui:cursor-not-allowed',
      focus: 'rui:ring-2 rui:ring-(--success-focus)',
      focusVisible: 'rui:focus-visible:ring-2 rui:focus-visible:ring-(--success-focus)',
      iconFocusColor: 'rui:text-(--success-focus)'
    },
    warning: {
      border: 'rui:border-gray-300',
      hoverBorder: 'rui:border-(--warning-border)',
      disabled: 'rui:bg-gray-100 rui:border-gray-200 rui:text-gray-400 rui:cursor-not-allowed',
      focus: 'rui:ring-2 rui:ring-(--warning-focus)',
      focusVisible: 'rui:focus-visible:ring-2 rui:focus-visible:ring-(--warning-focus)',
      iconFocusColor: 'rui:text-(--warning-focus)'
    },
    error: {
      border: 'rui:border-(--error-border)',
      hoverBorder: 'rui:border-(--error-border)',
      disabled: 'rui:bg-gray-100 rui:border-red-200 rui:text-gray-400 rui:cursor-not-allowed',
      focus: 'rui:ring-2 rui:ring-(--error-focus)',
      focusVisible: 'rui:focus-visible:ring-2 rui:focus-visible:ring-(--error-focus)',
      iconFocusColor: 'rui:text-(--error-focus)'
    }
  }

  const draggingBackgrounds = {
    primary: 'rui:bg-(--primary-selected-bg)',
    success: 'rui:bg-(--success-selected-bg)',
    warning: 'rui:bg-(--warning-selected-bg)',
    error: 'rui:bg-(--error-selected-bg)'
  }

  const activeVariantKey = errorMessage || internalError ? 'error' : variant
  const activeVariant = variants[activeVariantKey] || variants.primary
  const draggingBg = draggingBackgrounds[activeVariantKey] || draggingBackgrounds.primary

  const handleFileProcessing = useCallback(
    (files) => {
      const fileArray = Array.from(files)
      setInternalError('')

      if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim())
        const invalidFiles = fileArray.filter(
          (file) =>
            !acceptedTypes.some(
              (type) =>
                type.endsWith('/*') ? file.type.startsWith(type.slice(0, -1)) : file.type === type || file.name.endsWith(type)
            )
        )
        if (invalidFiles.length > 0) {
          setInternalError(`Tipo de archivo no válido. Aceptados: ${accept}`)
          setSelectedFiles([])
          if (onFilesSelect) onFilesSelect([])
          return
        }
      }

      const newFiles = multiple ? [...selectedFiles, ...fileArray] : [fileArray[0]]
      setSelectedFiles(newFiles)
      if (onFilesSelect) onFilesSelect(newFiles)
    },
    [accept, multiple, onFilesSelect, selectedFiles]
  )

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return
    const files = e.dataTransfer.files
    if (files?.length) handleFileProcessing(files)
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files?.length) handleFileProcessing(files)
  }

  const openFileDialog = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openFileDialog()
    }
  }

  const handleRemoveFile = (indexToRemove) => {
    const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove)
    setSelectedFiles(newFiles)
    if (onFilesSelect) onFilesSelect(newFiles)
    if (inputRef.current) inputRef.current.value = null
    if (newFiles.length === 0) setInternalError('')
  }

  useImperativeHandle(
    ref,
    () => ({
      open: openFileDialog,
      clear: () => {
        setSelectedFiles([])
        if (onFilesSelect) onFilesSelect([])
        if (inputRef.current) inputRef.current.value = null
        setInternalError('')
      }
    }),
    [onFilesSelect]
  )

  const dropzoneClasses = clsx(
    'rui:relative rui:border rui:rounded-lg rui:p-6 rui:text-center rui:outline-none',
    'rui:transition-[background-color,border-color,box-shadow,transform] rui:duration-200 rui:ease-out',
    'rui:min-h-[150px] rui:flex rui:flex-col rui:justify-center',
    activeVariant.border,
    activeVariant.focusVisible,
    {
      [activeVariant.disabled]: disabled,
      [`${activeVariant.hoverBorder} rui:cursor-pointer`]: !disabled,
      [draggingBg]: isDragging,
      [activeVariant.focus]: isDragging,
      'rui:scale-[1.01]': isDragging
    },
    className
  )

  const [previews, setPreviews] = useState({})
  useEffect(() => {
    const newPreviews = {}
    selectedFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        newPreviews[file.name] = URL.createObjectURL(file)
      }
    })
    setPreviews(newPreviews)

    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [selectedFiles])

  return (
    <div className={`rui:relative rui:w-full ${className}`}>
      {label && (
        <label htmlFor={id} className='rui:block rui:text-sm rui:font-medium rui:mb-1 rui:text-gray-900'>
          {label}
        </label>
      )}

      <input
        id={id}
        type='file'
        ref={inputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
        className='rui:hidden'
        disabled={disabled}
      />
      <div
        className={clsx(
          dropzoneClasses,
          'rui:flex rui:items-center rui:justify-center',
          'rui:h-37.5 rui:overflow-hidden'
        )}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role='button'
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        aria-describedby={errorMessage || internalError ? errorId : undefined}
        {...rest}
      >
        {selectedFiles.length === 0
          ? (
            <div className='rui:flex rui:flex-col rui:items-center rui:pointer-events-none'>
              <UploadCloud
                className={clsx(
                  'rui:w-12 rui:h-12 rui:transition-colors',
                  isDragging ? activeVariant.iconFocusColor : 'rui:text-gray-400'
                )}
              />
              <p className='rui:mt-2 rui:font-semibold rui:text-gray-700'>Arrastra y suelta archivos aquí</p>
              <p className='rui:text-sm rui:text-gray-500'>o haz clic para seleccionar</p>
            </div>
            )
          : (
            <div className='rui:w-full rui:h-full rui:flex rui:flex-col rui:text-left'>
              <h4 className='rui:font-semibold rui:text-gray-800 rui:mb-2 rui:shrink-0'>Archivos seleccionados:</h4>
              <div className='rui:flex-1 rui:overflow-y-auto rui:space-y-2 rui:pr-1 rui:custom-scrollbar'>
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className='rui:flex rui:items-center rui:justify-between rui:bg-gray-50 rui:p-2 rui:rounded-md rui:border rui:border-gray-100'
                  >
                    <div className='rui:flex rui:items-center rui:space-x-2 rui:overflow-hidden'>
                      {previews[file.name]
                        ? (
                          <img
                            src={previews[file.name]}
                            alt={`Previsualización de ${file.name}`}
                            className='rui:w-8 rui:h-8 rui:object-cover rui:rounded rui:shrink-0'
                          />
                          )
                        : (
                          <FileText className='rui:w-5 rui:h-5 rui:text-gray-500 rui:shrink-0' />
                          )}
                      <span className='rui:text-sm rui:text-gray-700 rui:truncate' title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile(index)
                      }}
                      className='rui:p-1 rui:text-gray-400 rui:hover:text-red-500 rui:rounded-full rui:transition-colors'
                      aria-label={`Quitar ${file.name}`}
                      disabled={disabled}
                    >
                      <X className='rui:w-4 rui:h-4' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            )}
      </div>
      <p id={errorId} className={clsx('rui:absolute rui:text-xs rui:mt-1 rui:h-4 rui:text-(--error-text)')}>
        {errorMessage || internalError}
      </p>
    </div>
  )
})

FileUpload.displayName = 'FileUpload'

export default FileUpload
