import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Button,
  alert,
  AlertContainer,
  AutoComplete,
  ButtonDropdown,
  CheckBox,
  DatePicker,
  FileUpload,
  InputText,
  Modal,
  Table,
  Toggle,
  Tooltip,
  InputRichText,
  Toaster,
  toast,
  Select,
  Breadcrumbs,
  Drawer,
  Container,
  Chart,
  Tabs,
  Accordion
} from '../dist/index'
import { ChevronDown, Home, Search } from 'lucide-react'

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [check, setCheck] = useState(false)
  const [selectError, setSelectError] = useState('')

  const handleRowSelection = (row) => {
    alert.primary(`Seleccionaste a: ${row.nombre}`)
  }

  const usersData = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      rol: 'Admin',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Maria Gomez',
      email: 'maria@example.com',
      rol: 'Editor',
      estado: 'Inactivo'
    },
    {
      id: 3,
      nombre: 'Carlos Lopez',
      email: 'carlos@example.com',
      rol: 'Usuario',
      estado: 'Activo'
    },
    {
      id: 4,
      nombre: 'Ana Torres',
      email: 'ana@example.com',
      rol: 'Admin',
      estado: 'Pendiente'
    },
    {
      id: 5,
      nombre: 'Luis Diaz',
      email: 'luis@example.com',
      rol: 'Usuario',
      estado: 'Activo'
    }
  ]

  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'nombre', header: 'Nombre Completo', sortable: true },
    { key: 'email', header: 'Correo Electrónico', sortable: true },
    { key: 'rol', header: 'Rol del Sistema', sortable: true },
    {
      key: 'estado',
      header: 'Estado Actual',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${value === 'Activo'
            ? 'bg-green-100 text-green-800'
            : value === 'Inactivo'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
            }`}
        >
          {value}
        </span>
      )
    }
  ]

  const Options = [
    { label: 'TODOS', value: null },
    { label: 'Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1 Opción 1', value: '1' },
    { label: 'Opción 2', value: '2' },
    { label: 'Opción 3', value: '3' },
    { label: 'Opción 4', value: '4' },
    { label: 'Opción 5', value: '5' },
    { label: 'Opción 6', value: '6' },
    { label: 'Opción 7', value: '7' },
    { label: 'Opción 8', value: '8' },
    { label: 'Opción 9', value: '9' },
    { label: 'Opción 10', value: '10' },
    { label: 'Opción 11', value: '11' },
    { label: 'Opción 12', value: '12' },
    { label: 'Opción 13', value: '13' },
    { label: 'Opción 14', value: '14' },
    { label: 'Opción 15', value: '15' }
  ]

  const myItems = [
    { label: 'Home', href: '/' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Detalle Crédito' }
  ]

  return (
    <>
      <div className='rui:flex rui:gap-4 rui:w-full rui:p-8'>
        {/* Botón para activar el Drawer */}
        <Container>
          <Button onClick={() => setOpen(true)} variant='primary'>
            Abrir Drawer
          </Button>
        </Container>

        {/* Implementación del Drawer */}
        <Drawer
          isOpen={open}
          onClose={() => setOpen(false)}
          title='Título del Drawer'
          placement='right'
          size='xl'
        >
          <div className='rui:flex rui:flex-col rui:gap-4'>
            <h2 className='rui:text-xl rui:font-bold'>Hola Mundo</h2>
            <p className='rui:text-gray-600'>
              Este es el contenido interno con scroll independiente si es muy largo. Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.Este es el contenido interno con scroll independiente si es muy largo.
            </p>
          </div>
        </Drawer>
      </div>
      <div className='rui:flex rui:flex-col rui:gap-4 rui:w-full rui:p-8'>
        <Breadcrumbs
          homeIcon={<Home size={16} />}
          items={myItems}
          separator={<span className='rui:opacity-50'>/</span>}
          variant='primary'
        />
      </div>
      {/* COMPONENT SELECT */}
      <div className='rui:flex rui:flex-col rui:gap-4 rui:w-full rui:p-8'>
        <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Select </h2>

        <div className='rui:flex rui:flex-col rui:gap-10'>
          <Select
            label='Selector con Validación'
            variant='primary'
            options={Options}
            placeholder='Selecciona una opción para probar error'
            errorMessage={selectError}
            fullWidth
            disabled
          />
          <AutoComplete
            label='Selector con Validación'
            variant='primary'
            options={Options}
            value={[{ label: 'Opción 1', value: '1' }]}
            placeholder='Selecciona una opción para probar error'
            errorMessage={selectError}
            fullWidth
            disabled
            multiSelect
          />

          <div className='rui:flex rui:gap-2 rui:mt-4'>
            <Button
              size='small'
              variant='error'
              onClick={() => setSelectError('Este campo es obligatorio')}
            >
              Activar Error
            </Button>

            <Button
              size='small'
              variant='ghost'
              onClick={() => setSelectError('')}
            >
              Limpiar Error
            </Button>
          </div>
        </div>
      </div>

      <div className='rui:p-8 rui:flex rui:flex-col rui:gap-4'>
        {/* COMPONENT INPUT RICH TEXT */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> TextArea - Format</h2>
          <InputRichText variant='primary' />
        </div>
        {/* COMPONENT ALERT */}
        <div className='rui:flex rui:flex-col rui:gap-4 rui:items-start'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Alert</h2>
          <AlertContainer position='top-right' />
          <Toaster position='bottom-right' />
          <Button onClick={() => alert.error('Hola, Mundo!')}>
            Botón Alert
          </Button>
          <Button onClick={() => toast.success(
            '¡Operación Exitosa!',
            'Los datos se han guardado correctamente en el servidor.'
          )}
          >
            Botón New Alert
          </Button>
        </div>
        {/* COMPONENT AUTOCOMPLETE */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> AutoComplete </h2>
          <div className='rui:flex rui:lg:flex-row rui:gap-4'>
            <AutoComplete
              variant='primary'
              options={Options}
              isClearable
              placeholder='Multi Selección'
              multiSelect
              fullWidth
            />

            <AutoComplete
              variant='primary'
              options={Options}
              isClearable
              placeholder='Selección Única'
              fullWidth
            />
          </div>
        </div>
        {/* COMPONENT SELECT */}
        <div className='rui:flex rui:flex-col rui:gap-4 rui:w-full'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Select </h2>
        </div>

        {/* COMPONENT BUTTON */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Button </h2>
          <div className='rui:flex rui:lg:flex-row rui:flex-col rui:gap-4'>
            <Button fullWidth variant='success'> Success </Button>
            <Button fullWidth variant='error'> Error </Button>
            <Button fullWidth variant='ghost'> Ghost </Button>
            <Button fullWidth variant='warning'> Warning </Button>
            <Button fullWidth variant='primary'> Primary </Button>
          </div>
        </div>
        {/* COMPONENT BUTTON DROP DOWN */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Button DropDown </h2>
          <div>
            <ButtonDropdown
              trigger={
                <Button textStyle='nowrap' variant='primary' endIcon={<ChevronDown size={20} />}>
                  Acciones
                </Button>
              }
            >
              <Button textStyle='nowrap' fullWidth variant='success'>
                Texto Mucho Mas Largo
              </Button>
              <Button textStyle='nowrap' fullWidth variant='error'>
                Error
              </Button>
              <Button textStyle='nowrap' fullWidth variant='primary' onClick={() => alert.success('Hola, Mundo!')}>
                Primary
              </Button>
            </ButtonDropdown>
          </div>
        </div>
        {/* COMPONENT CHECKBOX */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> CheckBox </h2>
          <CheckBox label='Checkbox Label Derecho' variant='primary' />
          <CheckBox label='Checkbox Label Izquierdo' labelPosition='left' />
        </div>
        {/* COMPONENT DATEPICKER */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> DatePicker </h2>
          <div className='rui:flex rui:lg:flex-row rui:flex-col rui:gap-4'>
            <DatePicker variant='primary' fullWidth placeholder='Selecciona fecha única' onChange={(dates) => console.log(dates)} range />
            <DatePicker variant='primary' placeholder='Días Máximos' rangeDays={29} range showTime />
            <Button> Test </Button>
            <DatePicker range variant='primary' fullWidth placeholder='Selecciona rango de fechas' />
            <DatePicker variant='primary' placeholder='Fechas Deshabilitadas' range />
          </div>
        </div>
        {/* COMPONENT FILE UPLOAD */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> FileUpload </h2>
          <FileUpload variant='primary' placeholder='Subir Archivo' accept='.pdf,.docx,.txt' />
        </div>
        {/* COMPONENT INPUT */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Input </h2>
          <div className='rui:flex rui:flex-row rui:gap-4'>
            <InputText variant='primary' placeholder='Ingresa texto' fullWidth />
            <InputText variant='primary' placeholder='Input Clearable' isClearable fullWidth />
            <InputText variant='primary' iconLeft={<Search size={14} />} placeholder='Ingresa texto' fullWidth />
          </div>
        </div>
        {/* COMPONENT MODAL */}
        <div className='rui:flex rui:flex-col rui:gap-4 rui:items-start'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Modal </h2>
          <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title='Título del Modal'
            size='md'
            variant='primary'
            closeOnOverlayClick={false}
          >
            <p>Contenido del modal</p>
          </Modal>
        </div>
        {/* COMPONENT TOGGLE */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Toggle </h2>
          <Toggle label='Toggle Label' disabled variant='success' checked onChange={() => setCheck(!check)} />
        </div>
        {/* COMPONENT TOOLTIP */}
        <div className='rui:flex rui:flex-col rui:gap-4 rui:-ml-10'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Tooltip </h2>
          <Tooltip content='Tooltip Label' variant='success' position='top'>
            <Button variant='primary'>Hover me</Button>
          </Tooltip>
        </div>
        {/* COMPONENT TABLE */}
        <div className='rui:flex rui:flex-col rui:gap-4'>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'> Table </h2>
          <div className='rui:flex rui:flex-col rui:gap-4'>
            <Table
              data={usersData}
              columns={columns}
              variant='primary'
              fullWidth
            />
            <Table
              data={usersData}
              columns={columns}
              enableSorting
              enableFiltering
              variant='success'
              rowsPerPageOptions={[5, 10, 20]}
              defaultRowsPerPage={5}
              boldHeaders
            />
            <Table
              data={[]}
              loadingInfo
              textLoading='Consultando base de datos de clientes...'
              titleNoData='No encontramos resultados'
              subTitleNoData='Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas.'
              variant='primary'
            />
            <Table
              data={usersData}
              columns={columns}
              variant='primary'
              fullWidth
              disablePagination
            />

            <Table
              data={usersData}
              onRowClick={handleRowSelection}
              disablePagination={false}
            />

            <Table
              data={usersData}
              columns={columns}
              variant='primary'
              actions={(row) => (
                <>
                  <Button variant='primary' onClick={() => alert.warning('Edit: ' + row.id)}>Editar</Button>
                  <Button variant='error' onClick={() => alert.error('Delete: ' + row.nombre)}>Eliminar</Button>
                </>
              )}
            />
          </div>
        </div>
      </div>
      <div className='rui:p-8 rui:flex rui:flex-col rui:gap-10'>
        <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline'>Chart</h2>
        <div className='rui:grid rui:lg:grid-cols-2 rui:gap-8'>
          <div className='rui:p-6 rui:border rui:border-gray-200 rui:rounded-xl'>
            <Chart
              type='bar'
              title='Ventas vs Gastos'
              data={[
                { label: 'Ene', ventas: 4200, gastos: 2800 },
                { label: 'Feb', ventas: 3800, gastos: 2600 },
                { label: 'Mar', ventas: 5100, gastos: 3100 },
                { label: 'Abr', ventas: 4700, gastos: 3400 },
                { label: 'May', ventas: 6200, gastos: 3800 },
                { label: 'Jun', ventas: 5800, gastos: 3600 }
              ]}
              series={[
                { key: 'ventas', name: 'Ventas' },
                { key: 'gastos', name: 'Gastos' }
              ]}
              valueFormatter={(v) => `$${v.toLocaleString()}`}
            />
          </div>

          <div className='rui:p-6 rui:border rui:border-gray-200 rui:rounded-xl'>
            <Chart
              type='line'
              title='Usuarios activos'
              data={[
                { label: 'Ene', web: 1200, movil: 800 },
                { label: 'Feb', web: 1350, movil: 950 },
                { label: 'Mar', web: 1100, movil: 1200 },
                { label: 'Abr', web: 1600, movil: 1400 },
                { label: 'May', web: 1750, movil: 1650 },
                { label: 'Jun', web: 2000, movil: 1900 }
              ]}
              series={[
                { key: 'web', name: 'Web' },
                { key: 'movil', name: 'Móvil' }
              ]}
            />
          </div>

          <div className='rui:p-6 rui:border rui:border-gray-200 rui:rounded-xl'>
            <Chart
              type='pie'
              title='Origen de tráfico'
              data={[
                { label: 'Orgánico', value: 400 },
                { label: 'Directo', value: 300 },
                { label: 'Redes sociales', value: 150 },
                { label: 'Referidos', value: 90 },
                { label: 'Email', value: 60 }
              ]}
            />
          </div>

          <div className='rui:p-6 rui:border rui:border-gray-200 rui:rounded-xl'>
            <Chart
              type='donut'
              title='Estado de tickets'
              data={[
                { label: 'Resueltos', value: 62 },
                { label: 'En progreso', value: 21 },
                { label: 'Pendientes', value: 17 }
              ]}
            />
          </div>
        </div>
      </div>
      <div className='rui:p-8 rui:flex rui:flex-col rui:gap-10'>
        <div>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline rui:mb-4'>Tabs</h2>
          <Tabs
            variant='primary'
            items={[
              {
                key: 'general',
                label: 'General',
                content: <p className='rui:text-sm rui:text-gray-600'>Contenido de la pestaña General.</p>
              },
              {
                key: 'seguridad',
                label: 'Seguridad',
                content: <p className='rui:text-sm rui:text-gray-600'>Contenido de la pestaña Seguridad.</p>
              },
              {
                key: 'facturacion',
                label: 'Facturación',
                content: <p className='rui:text-sm rui:text-gray-600'>Contenido de la pestaña Facturación.</p>
              },
              {
                key: 'deshabilitada',
                label: 'Deshabilitada',
                disabled: true,
                content: <p className='rui:text-sm rui:text-gray-600'>No deberías ver esto.</p>
              }
            ]}
          />
        </div>

        <div>
          <h2 className='rui:text-lg rui:font-bold rui:decoration-solid rui:underline rui:mb-4'>Accordion</h2>
          <Accordion
            variant='primary'
            defaultValue={['faq1']}
            items={[
              {
                key: 'faq1',
                title: '¿Cómo cambio mi contraseña?',
                content: 'Ve a Configuración → Seguridad → Cambiar contraseña. Te pediremos la contraseña actual antes de guardar la nueva.'
              },
              {
                key: 'faq2',
                title: '¿Puedo cancelar en cualquier momento?',
                content: 'Sí, la cancelación es inmediata y no genera cargos adicionales. Mantienes acceso hasta el fin del período pagado.'
              },
              {
                key: 'faq3',
                title: 'Opción deshabilitada',
                disabled: true,
                content: 'No deberías ver esto.'
              }
            ]}
          />
        </div>
      </div>
      <div className='rui:p-8 rui:bg-gray-50 rui:border rui:border-dashed rui:border-gray-300 rui:rounded-xl rui:mt-12'>
        <h2 className='rui:text-lg rui:font-bold rui:text-orange-600 rui:underline rui:mb-1'>
          🧪 Test: Borde de error consistente entre componentes
        </h2>
        <p className='rui:text-sm rui:text-gray-600 rui:mb-6'>
          Todos los campos de abajo tienen <code>errorMessage</code> seteado a la vez — el borde/ring rojo debería verse idéntico en todos, sin importar el componente.
        </p>
        <div className='rui:grid rui:sm:grid-cols-2 rui:lg:grid-cols-3 rui:gap-6'>
          <InputText
            label='Input'
            placeholder='Ingresa texto'
            errorMessage='Este campo es obligatorio'
            fullWidth
          />
          <Select
            label='Select'
            options={Options}
            placeholder='Selecciona una opción'
            errorMessage='Debes seleccionar una opción'
            fullWidth
          />
          <AutoComplete
            label='AutoComplete'
            options={Options}
            placeholder='Busca una opción'
            errorMessage='Debes seleccionar una opción'
            fullWidth
          />
          <DatePicker
            label='DatePicker'
            placeholder='Selecciona una fecha'
            errorMessage='La fecha es obligatoria'
            fullWidth
          />
          <FileUpload
            label='FileUpload'
            errorMessage='Debes subir al menos un archivo'
          />
          <InputRichText
            label='InputRichText'
            placeholder='Escribe algo...'
            errorMessage='El contenido es obligatorio'
            fullWidth
          />
          <CheckBox
            label='CheckBox obligatorio'
            errorMessage='Debes aceptar para continuar'
          />
          <Toggle
            label='Toggle obligatorio'
            errorMessage='Debes activar esta opción'
          />
        </div>
      </div>
      <div className='rui:flex rui:flex-col rui:gap-4 rui:p-8 rui:bg-gray-50 rui:border rui:border-dashed rui:border-gray-300 rui:rounded-xl rui:mt-12'>
        <h2 className='rui:text-lg rui:font-bold rui:text-orange-600 rui:underline'>
          🧪 Test: Desplegables al final de la página
        </h2>
        <p className='rui:text-sm rui:text-gray-600 rui:mb-4'>
          Como este bloque está en el límite inferior del documento, ambos componentes deben detectar la falta de espacio y abrir su menú **hacia arriba** sin cortar el contenido ni generar scrolls innecesarios.
        </p>

        <div className='rui:flex rui:lg:flex-row rui:flex-col rui:gap-6'>
          <Select
            label='Select Dinámico'
            variant='primary'
            options={Options}
            placeholder='Selecciona (Hacia arriba)'
            fullWidth
            isClearable
          />

          <AutoComplete
            label='AutoComplete Dinámico'
            variant='primary'
            options={Options}
            placeholder='Busca u opta (Hacia arriba)'
            fullWidth
            isClearable
          />
        </div>
      </div>
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
