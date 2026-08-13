# Alert

Sistema de notificaciones tipo toast para React. Permite mostrar alertas temporales y apiladas en distintas posiciones de la pantalla, con soporte para múltiples variantes visuales.

---

## Instalación y dependencias

```bash
npm install clsx
```

El componente utiliza:

- `react` (hooks: `useEffect`, `useState`, `useRef`)
- `react-dom` (`createPortal`)
- `clsx` — para composición condicional de clases CSS

---

## Uso rápido

### 1. Montar el contenedor

Agrega `<AlertContainer />` una sola vez en el árbol de componentes, idealmente en el layout raíz:

```jsx
import { AlertContainer } from "react-ui-componentes";

export default function App() {
  return (
    <>
      <AlertContainer />
      {/* resto de la app */}
    </>
  );
}
```

### 2. Disparar alertas desde cualquier parte

```jsx
import { alert } from "react-ui-componentes";

// Variantes de conveniencia
alert.success("Operación exitosa");
alert.error("Ocurrió un error");
alert.warning("Atención requerida");
alert.primary("Información general");

// Llamada directa con opciones completas
alert({
  title: "Título del mensaje",
  subtitle: "Descripción adicional del mensaje",
  variant: "success",
  duration: 4000,
  position: "bottom-right",
  closable: true,
});
```

---

## API

### `alert(data)`

Función principal para crear una alerta. Retorna el `id` numérico de la alerta creada.

| Parámetro  | Tipo        | Por defecto    | Descripción                                               |
| ---------- | ----------- | -------------- | --------------------------------------------------------- |
| `title`    | `string`    | `''`           | Título principal de la alerta                             |
| `subtitle` | `string`    | `''`           | Texto secundario o mensaje descriptivo (alias: `message`) |
| `variant`  | `string`    | `'primary'`    | Estilo visual. Ver [Variantes](#variantes)                |
| `duration` | `number`    | `5000`         | Duración en ms antes de cerrarse. `0` = no se cierra      |
| `position` | `string`    | `'top-right'`  | Posición en pantalla. Ver [Posiciones](#posiciones)       |
| `closable` | `boolean`   | `true`         | Muestra botón para cerrar manualmente                     |
| `icon`     | `ReactNode` | _(automático)_ | Ícono personalizado. `null` oculta el ícono               |

### Métodos de conveniencia

```js
alert.success(title, options?)   // variante success
alert.error(title, options?)     // variante error
alert.warning(title, options?)   // variante warning
alert.primary(title, options?)   // variante primary
```

Cada método acepta `title` como primer argumento y un objeto `options` opcional con cualquier campo de `alert(data)` excepto `variant` y `title`.

### `alert.dismiss(id?)`

Cierra una alerta o todas las alertas activas.

```js
const id = alert.success("Guardado");
alert.dismiss(id); // cierra solo esa alerta
alert.dismiss(); // cierra todas las alertas
```

---

## Componentes

### `<AlertContainer />`

Contenedor global que renderiza las alertas activas mediante `createPortal` directamente en `document.body`.

| Prop       | Tipo     | Por defecto   | Descripción                                           |
| ---------- | -------- | ------------- | ----------------------------------------------------- |
| `position` | `string` | `'top-right'` | Posición por defecto para alertas sin posición propia |

> **Nota:** Solo debe montarse una vez en toda la aplicación.

---

## Variantes

Cada variante aplica un conjunto de colores (fondo, texto, borde) definidos mediante CSS custom properties (`var(--*)`).

| Variante     | Ícono por defecto       | Variables CSS usadas                                          |
| ------------ | ----------------------- | ------------------------------------------------------------- |
| `primary`    | `InformationCircleIcon` | `--primary-bg`, `--primary-text`, `--primary-border`          |
| `success`    | `CheckCircleIcon`       | `--success-bg`, `--success-text`, `--success-border`          |
| `error`      | `ExclamationCircleIcon` | `--error-bg`, `white`, `--error-border`                       |
| `warning`    | `ExclamationCircleIcon` | `--warning-bg`, `--warning-text`, `--warning-border`          |

---

## Posiciones

| Valor           | Descripción                        |
| --------------- | ---------------------------------- |
| `top-right`     | Esquina superior derecha (default) |
| `top-left`      | Esquina superior izquierda         |
| `top-center`    | Centro superior                    |
| `bottom-right`  | Esquina inferior derecha           |
| `bottom-left`   | Esquina inferior izquierda         |
| `bottom-center` | Centro inferior                    |

---

## Apilamiento (stacking)

Cuando hay múltiples alertas activas, se muestran apiladas con efecto de perspectiva:

- Se muestran **hasta 3 alertas visibles** simultáneamente.
- Las alertas adicionales se ocultan (`opacity: 0`, `pointerEvents: none`).
- Cada nivel reduce la escala en `0.05` y el `opacity` en `0.15`, generando profundidad visual.

---

## Animaciones

Las alertas aparecen y desaparecen con transición de `300ms`. La dirección de la animación depende de la posición:

| Posición        | Entrada / Salida                   |
| --------------- | ---------------------------------- |
| `*-right`       | Desliza desde / hacia la derecha   |
| `*-left`        | Desliza desde / hacia la izquierda |
| `top-center`    | Desliza desde / hacia arriba       |
| `bottom-center` | Desliza desde / hacia abajo        |

---

## Accesibilidad

- El elemento raíz tiene `role="alert"`, `aria-live="assertive"` y `aria-atomic="true"`.
- El botón de cierre incluye `aria-label="Cerrar alerta"`.

---

## Íconos internos

Los íconos predeterminados son SVGs inline sin dependencias externas:

| Componente              | Uso                                         |
| ----------------------- | ------------------------------------------- |
| `CheckCircleIcon`       | Variante `success`                          |
| `ExclamationCircleIcon` | Variantes `error` y `warning`               |
| `InformationCircleIcon` | Variante `primary`                          |
| `XIcon`                 | Botón de cierre                             |

Para reemplazar el ícono de una alerta específica, pasa la prop `icon`:

```jsx
alert.success("Listo", { icon: <MiIcono /> }); // ícono personalizado
alert.success("Listo", { icon: null }); // sin ícono
```

---

## Ejemplo completo

```jsx
import { AlertContainer, alert } from "react-ui-componentes";

// En tu layout raíz:
function Layout({ children }) {
  return (
    <>
      <AlertContainer />
      {children}
    </>
  );
}

// En cualquier componente:
function FormularioGuardado() {
  const handleGuardar = async () => {
    try {
      await guardarDatos();
      alert.success("Guardado correctamente", {
        subtitle: "Los cambios fueron aplicados.",
        position: "bottom-right",
        duration: 4000,
      });
    } catch (e) {
      alert.error("Error al guardar", {
        subtitle: e.message,
        closable: true,
        duration: 0,
      });
    }
  };

  return <button onClick={handleGuardar}>Guardar</button>;
}
```

# AutoComplete

Componente de entrada con sugerencias desplegables para React. Soporta selección simple, selección múltiple (chips), modo libre (`freeSolo`), agrupación de opciones, estado de carga y control externo del valor.

---

## Instalación y dependencias

```bash
npm install clsx lucide-react
```

El componente utiliza:

- `react` (hooks: `forwardRef`, `useEffect`, `useRef`, `useState`, `useImperativeHandle`)
- `react-dom` (`createPortal`) — el dropdown se renderiza fuera del DOM del componente
- `clsx` — composición condicional de clases CSS
- `lucide-react` — íconos `ChevronDown`, `X`, `Loader2`

---

## Uso básico

```jsx
import { AutoComplete } from "react-ui-componentes";

const options = [
  { value: "1", label: "Chile" },
  { value: "2", label: "Argentina" },
  { value: "3", label: "Perú" },
];

function App() {
  const [value, setValue] = useState(null);

  return (
    <AutoComplete
      label="País"
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Selecciona un país"
    />
  );
}
```

---

## Props

| Prop            | Tipo                        | Por defecto                     | Descripción                                                                          |
| --------------- | --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| `value`         | `object \| array \| string` | —                               | Valor controlado. Si se omite, el componente gestiona su propio estado               |
| `onChange`      | `function`                  | `() => {}`                      | Callback al cambiar el valor. Recibe la opción seleccionada o `null`                 |
| `options`       | `array`                     | `[]`                            | Lista de opciones disponibles. Ver [Estructura de opciones](#estructura-de-opciones) |
| `placeholder`   | `string`                    | `'Escribe algo...'`             | Texto del input cuando no hay valor                                                  |
| `noOptionsText` | `string`                    | `'No hay opciones disponibles'` | Texto mostrado cuando el filtro no retorna resultados                                |
| `label`         | `string`                    | `''`                            | Etiqueta visible sobre el campo                                                      |
| `variant`       | `string`                    | `'primary'`                     | Color del foco y selección. Ver [Variantes](#variantes)                              |
| `size`          | `string`                    | `'medium'`                      | Tamaño del campo. Ver [Tamaños](#tamaños)                                            |
| `multiSelect`   | `boolean`                   | `false`                         | Habilita selección múltiple con chips                                                |
| `maxVisibleChips` | `number`                  | `3`                              | En `multiSelect`, cantidad de chips mostrados antes de colapsar el resto en "+N más"  |
| `isClearable`   | `boolean`                   | `false`                         | Muestra botón `✕` para limpiar el valor cuando hay una selección                     |
| `disabled`      | `boolean`                   | `false`                         | Deshabilita toda interacción con el componente                                       |
| `freeSolo`      | `boolean`                   | `false`                         | Permite ingresar texto libre que no coincida con ninguna opción                      |
| `loading`       | `boolean`                   | `false`                         | Muestra un spinner en lugar del ícono de flecha                                      |
| `defaultValue`  | `object \| array \| null`   | `null`                          | Valor inicial en modo no controlado                                                  |
| `errorMessage`  | `string`                    | `''`                            | Mensaje de error mostrado bajo el campo; activa el borde rojo                        |
| `colorMessage`  | `string`                    | `'error'`                       | Color del mensaje (actualmente usa siempre `--error-bg`)                             |
| `name`          | `string`                    | `''`                            | Atributo `name` del input interno; incluido en el evento `onBlur`                    |
| `onBlur`        | `function`                  | —                               | Callback al perder el foco. Recibe `{ target: { name, value } }`                     |
| `fullWidth`     | `boolean`                   | `false`                         | Expande el componente al 100% del ancho de su contenedor                             |
| `iconLeft`      | `ReactNode`                 | —                               | Ícono renderizado a la izquierda del input (se clona con el `size` adecuado)         |
| `className`     | `string`                    | `''`                            | Clases CSS adicionales para el contenedor externo                                    |
| `...rest`       | —                           | —                               | Atributos HTML adicionales propagados al elemento `<input>`                          |

---

## Estructura de opciones

Cada elemento del array `options` debe ser un objeto con la siguiente forma:

```ts
{
  value: string | number | null,  // identificador único
  label: string,                  // texto visible en el dropdown y en el campo
  group?: string                  // (opcional) agrupa las opciones bajo un encabezado
}
```

### Opción especial "Todos"

En modo `multiSelect`, si una opción tiene `value: null` o su `label` es `'TODOS'` (mayúsculas), al seleccionarla reemplaza cualquier selección previa con solo esa opción.

### Agrupación

Las opciones con el mismo valor en `group` se agrupan automáticamente bajo un encabezado en el dropdown. Las opciones deben estar ordenadas por grupo en el array para que el encabezado aparezca correctamente.

```jsx
const options = [
  { value: "1", label: "Santiago", group: "Chile" },
  { value: "2", label: "Valparaíso", group: "Chile" },
  { value: "3", label: "Lima", group: "Perú" },
];
```

---

## Variantes

Controlan el color del anillo de foco y el fondo de las opciones seleccionadas en el dropdown. Se configuran mediante CSS custom properties.

| Variante     | Variables CSS usadas                               |
| ------------ | -------------------------------------------------- |
| `primary`    | `--primary-bg`, `--primary-selected-bg/text`       |
| `success`    | `--success-bg`, `--success-selected-bg/text`       |
| `warning`    | `--warning-bg`, `--warning-selected-bg/text`       |
| `error`      | `--error-bg`, `--error-selected-bg/text`           |

---

## Tamaños

| Valor    | Altura | Fuente             | Border radius |
| -------- | ------ | ------------------ | ------------- |
| `small`  | 32px   | `text-xs` (12px)   | `rounded-md`  |
| `medium` | 36px   | `text-sm` (14px)   | `rounded-lg`  |
| `large`  | 40px   | `text-base` (16px) | `rounded-lg`  |

---

## Ref imperativa

El componente acepta una `ref` con los siguientes métodos expuestos:

```ts
ref.current.focus(); // Enfoca el input interno
ref.current.getValue(); // Retorna el valor actual
```

```jsx
const autoRef = useRef(null)

<AutoComplete ref={autoRef} options={options} />

// En otro lugar:
autoRef.current.focus()
const current = autoRef.current.getValue()
```

---

## Modo `freeSolo`

Cuando `freeSolo={true}`, el usuario puede ingresar texto que no corresponda a ninguna opción del listado. Al perder el foco, `onChange` recibe:

```js
{ value: null, label: 'texto ingresado' }
```

En modo controlado con `freeSolo`, el `value` puede ser directamente un `string`.

---

## Modo `multiSelect`

Al activar `multiSelect={true}`:

- El valor es siempre un `array` de opciones `{ value, label }`.
- Las opciones seleccionadas aparecen como **chips** dentro del input.
- Cada chip tiene un botón `✕` para eliminarlo individualmente.
- Al seleccionar una opción ya elegida, se **deselecciona** (toggle).
- El `defaultValue` debe ser un array (`defaultValue={[]}`).
- Solo se muestran los primeros `maxVisibleChips` (3 por defecto); el resto se colapsa en un chip `+N más` que expande la lista completa al hacer clic (y muestra los nombres ocultos en un tooltip nativo). Esto evita que el campo crezca sin límite verticalmente cuando hay muchas selecciones.

```jsx
const [values, setValues] = useState([])

<AutoComplete
  multiSelect
  options={options}
  value={values}
  onChange={setValues}
  isClearable
/>
```

---

## Comportamiento del dropdown

- Se renderiza via `createPortal` en `document.body`, evitando problemas de `overflow: hidden` en contenedores padre.
- Se posiciona calculando el `getBoundingClientRect` del input y sumando el scroll actual.
- Se cierra automáticamente al hacer scroll fuera del dropdown, al redimensionar la ventana, o al hacer clic fuera del componente.
- El ancho del dropdown coincide exactamente con el ancho del input.
- Muestra un máximo de **56 unidades** de alto (scroll interno) cuando hay muchas opciones.

---

## Navegación por teclado

| Tecla       | Acción                                                             |
| ----------- | ------------------------------------------------------------------ |
| `ArrowDown` | Mueve el foco a la siguiente opción (abre el menú si está cerrado) |
| `ArrowUp`   | Mueve el foco a la opción anterior                                 |
| `Enter`     | Selecciona la opción activa                                        |
| `Escape`    | Cierra el dropdown                                                 |

---

## Estado de carga

Al pasar `loading={true}`, el ícono de flecha (`ChevronDown`) se reemplaza por un spinner animado (`Loader2`). Útil para búsquedas asíncronas donde las opciones se cargan desde una API.

```jsx
<AutoComplete
  options={remoteOptions}
  loading={isFetching}
  onChange={handleChange}
/>
```

---

## Ejemplos

### Con ícono a la izquierda y mensaje de error

```jsx
import { Search } from "lucide-react";

<AutoComplete
  label="Buscar ciudad"
  options={cities}
  iconLeft={<Search />}
  errorMessage="Debes seleccionar una ciudad"
  fullWidth
/>;
```

### Selección múltiple con opción "Todos"

```jsx
const options = [
  { value: null, label: 'Todos' },
  { value: '1', label: 'Opción A' },
  { value: '2', label: 'Opción B' },
]

<AutoComplete
  multiSelect
  options={options}
  value={selected}
  onChange={setSelected}
  isClearable
  variant="primary"
/>
```

### Búsqueda asíncrona con `freeSolo`

```jsx
const [query, setQuery] = useState(null);
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);

const handleChange = async (val) => {
  setQuery(val);
  if (val?.label) {
    setLoading(true);
    const data = await fetchSuggestions(val.label);
    setResults(data);
    setLoading(false);
  }
};

<AutoComplete
  freeSolo
  options={results}
  value={query}
  onChange={handleChange}
  loading={loading}
  placeholder="Escribe para buscar..."
/>;
```

# Breadcrumbs

Componente de navegación contextual que muestra la ruta jerárquica dentro de una aplicación. Soporta íconos, separadores personalizados, acciones por clic y componentes de enlace externos (como `react-router-dom`).

---

## Instalación y dependencias

```bash
npm install clsx lucide-react
```

El componente utiliza:

- `clsx` — composición condicional de clases CSS
- `lucide-react` — ícono `ChevronRight` (separador por defecto)

---

## Uso básico

```jsx
import { Breadcrumbs } from "react-ui-componentes";

<Breadcrumbs
  items={[
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    { label: "Detalle" },
  ]}
/>;
```

El último elemento se renderiza como texto estático (página actual). Los anteriores son enlaces interactivos si tienen `href` u `onClick`.

---

## Props

| Prop            | Tipo          | Por defecto        | Descripción                                                                           |
| --------------- | ------------- | ------------------ | ------------------------------------------------------------------------------------- |
| `items`         | `array`       | `[]`               | Lista de elementos del breadcrumb. Ver [Estructura de items](#estructura-de-items)    |
| `separator`     | `ReactNode`   | `<ChevronRight />` | Elemento separador entre items                                                        |
| `homeIcon`      | `ReactNode`   | —                  | Ícono mostrado solo en el **primer** item, antes del label                            |
| `variant`       | `string`      | `'primary'`        | Color del hover en los enlaces. Ver [Variantes](#variantes)                           |
| `linkComponent` | `elementType` | `'a'`              | Componente usado para renderizar los enlaces. Ver [Enrutadores](#uso-con-enrutadores) |
| `className`     | `string`      | `''`               | Clases CSS adicionales para el elemento `<nav>`                                       |

> Si `items` está vacío o no se provee, el componente retorna `null` y no renderiza nada.

---

## Estructura de items

Cada elemento del array `items` puede tener las siguientes propiedades:

| Propiedad | Tipo        | Descripción                                                                                            |
| --------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `label`   | `string`    | **Requerido.** Texto visible del item                                                                  |
| `href`    | `string`    | URL de destino. Convierte el item en un enlace navegable                                               |
| `onClick` | `function`  | Callback al hacer clic. Tiene prioridad sobre la navegación por `href`                                 |
| `icon`    | `ReactNode` | Ícono mostrado a la izquierda del label. En el primer item, solo aplica si `homeIcon` no está definido |

Un item es **interactivo** (con cursor y hover) únicamente si no es el último Y tiene `href` o `onClick`. Un item sin ninguno de los dos se renderiza como texto no clicable.

---

## Variantes

Controlan el color aplicado al hover de los enlaces mediante CSS custom properties.

| Variante     | Variable CSS usada |
| ------------ | ------------------ |
| `primary`    | `--primary-bg`     |

---

## Comportamiento del último item

El último elemento del array siempre se renderiza como `<span>` (no como enlace), con estilo `font-semibold` y color oscuro, representando la página actual. Los eventos `href` y `onClick` se ignoran para este item.

---

## Ícono de inicio (`homeIcon`)

La prop `homeIcon` aplica un ícono **exclusivamente al primer item**, independientemente de si ese item tiene su propia prop `icon`. Si `homeIcon` está definido, la prop `icon` del primer item es ignorada.

```jsx
import { Home } from "lucide-react";

<Breadcrumbs
  homeIcon={<Home size={16} />}
  items={[
    { label: "Inicio", href: "/" },
    { label: "Configuración", href: "/config" },
    { label: "Perfil" },
  ]}
/>;
```

Para el resto de items (que no sean el primero), la prop `icon` del item sí se renderiza normalmente.

---

## Separador personalizado

```jsx
<Breadcrumbs items={items} separator={<span className="mx-1">/</span>} />
```

Acepta cualquier `ReactNode`: texto, SVG, o un componente.

---

## Uso con enrutadores

Por defecto usa `<a href>`. Para integrarlo con `react-router-dom` u otro enrutador, pasa el componente `Link` mediante `linkComponent`. El componente detecta si no es `'a'` nativo y usa la prop `to` en lugar de `href`.

```jsx
import { Link } from "react-router-dom";

<Breadcrumbs
  linkComponent={Link}
  items={[
    { label: "Inicio", href: "/" },
    { label: "Usuarios", href: "/usuarios" },
    { label: "Ana García" },
  ]}
/>;
```

> **Nota:** Cuando `linkComponent` no es `'a'`, el `href` de cada item se pasa como prop `to` al componente de enlace.

---

## Accesibilidad

- El contenedor raíz es un `<nav>` con `aria-label="Breadcrumb"`.
- Los items se renderizan como `<ol>` + `<li>`, estructura semántica estándar para breadcrumbs.
- El texto del último item (página actual) es un `<span>` no interactivo.
- Los enlaces no interactivos (sin `href` ni `onClick`) tienen `cursor: default` y bloquean la navegación con `e.preventDefault()`.

---

## Ejemplos

### Con íconos por item

```jsx
import { Package, Tag } from "lucide-react";

<Breadcrumbs
  items={[
    { label: "Catálogo", href: "/catalogo", icon: <Package size={14} /> },
    {
      label: "Electrónica",
      href: "/catalogo/electronica",
      icon: <Tag size={14} />,
    },
    { label: "Smartphones" },
  ]}
  variant="primary"
/>;
```

### Con `onClick` en lugar de `href`

```jsx
<Breadcrumbs
  items={[
    { label: "Dashboard", onClick: () => navigate("/dashboard") },
    { label: "Reportes", onClick: () => navigate("/reportes") },
    { label: "Mensual" },
  ]}
/>
```

### Item intermedio no interactivo

Un item sin `href` ni `onClick` se muestra como texto plano sin cursor ni hover, útil para secciones sin URL propia.

```jsx
<Breadcrumbs
  items={[
    { label: "Inicio", href: "/" },
    { label: "Sección sin enlace" }, // no interactivo
    { label: "Subsección", href: "/sub" },
    { label: "Página actual" },
  ]}
/>
```

# Button

Componente de botón flexible para React. Soporta múltiples variantes de color, tamaños, bordes redondeados, sombras, íconos (inicio y fin), estado de carga y control total de tipografía.

---

## Instalación y dependencias

```bash
npm install clsx
```

El componente utiliza:

- `react` (`forwardRef`)
- `clsx` — composición condicional de clases CSS

---

## Uso básico

```jsx
import { Button } from "react-ui-componentes"

<Button>Guardar</Button>
<Button variant="success" size="large">Confirmar</Button>
<Button variant="ghost" disabled>No disponible</Button>
```

---

## Props

| Prop         | Tipo        | Por defecto | Descripción                                                                          |
| ------------ | ----------- | ----------- | ------------------------------------------------------------------------------------ |
| `children`   | `ReactNode` | —           | Contenido del botón (texto u otros elementos)                                        |
| `variant`    | `string`    | `'primary'` | Estilo visual del botón. Ver [Variantes](#variantes)                                 |
| `size`       | `string`    | `'medium'`  | Tamaño del botón. Ver [Tamaños](#tamaños)                                            |
| `rounded`    | `string`    | `'md'`      | Radio de borde. Ver [Bordes redondeados](#bordes-redondeados)                        |
| `shadow`     | `string`    | `'md'`      | Sombra del botón. Ver [Sombras](#sombras)                                            |
| `fontWeight` | `string`    | `'medium'`  | Peso tipográfico. Ver [Tipografía](#tipografía)                                      |
| `textStyle`  | `string`    | `'normal'`  | Comportamiento del texto. Ver [Tipografía](#tipografía)                              |
| `startIcon`  | `ReactNode` | —           | Ícono renderizado a la **izquierda** del texto                                       |
| `endIcon`    | `ReactNode` | —           | Ícono renderizado a la **derecha** del texto                                         |
| `fullWidth`  | `boolean`   | `false`     | Expande el botón al 100% del ancho disponible                                        |
| `disabled`   | `boolean`   | `false`     | Deshabilita el botón (opacidad reducida, cursor `not-allowed`)                       |
| `loading`    | `boolean`   | `false`     | Muestra un spinner y bloquea la interacción. Ver [Estado de carga](#estado-de-carga) |
| `ariaLabel`  | `string`    | —           | Valor del atributo `aria-label` del botón                                            |
| `className`  | `string`    | `''`        | Clases CSS adicionales para el botón                                                 |
| `...rest`    | —           | —           | Atributos HTML adicionales propagados al elemento `<button>`                         |

---

## Variantes

Cada variante define los colores de fondo, hover, active y texto mediante CSS custom properties.

| Variante     | Estado normal     | Hover                | Active                | Texto               |
| ------------ | ----------------- | -------------------- | --------------------- | ------------------- |
| `primary`    | `--primary-bg`    | `--primary-hover`    | `--primary-active`    | `--primary-text`    |
| `success`    | `--success-bg`    | `--success-hover`    | `--success-active`    | `--success-text`    |
| `error`      | `--error-bg`      | `--error-hover`      | `--error-active`      | `white`             |
| `warning`    | `--warning-bg`    | `--warning-hover`    | `--warning-active`    | `--warning-text`    |
| `ghost`      | `transparent`     | `--ghost-hover`      | `--ghost-active`      | `--ghost-text`      |
| `link`       | `transparent`     | underline            | underline             | `--link-text`       |

> **`ghost`** incluye un borde (`--ghost-border`) además de fondo transparente.
> **`link`** elimina el padding (`p-0`) y aplica subrayado en hover/active.

---

## Tamaños

| Valor    | Altura | Padding     | Fuente             | Espaciado íconos |
| -------- | ------ | ----------- | ------------------ | ---------------- |
| `small`  | 32px   | `px-3 py-2` | `text-xs` (12px)   | `space-x-1.5`    |
| `medium` | 36px   | `px-4 py-2` | `text-sm` (14px)   | `space-x-2`      |
| `large`  | 40px   | `px-6 py-4` | `text-base` (16px) | `space-x-2.5`    |

Los íconos también se escalan con el tamaño: `12×12px` (small), `16×16px` (medium), `20×20px` (large).

---

## Bordes redondeados

| Valor  | Clase CSS      |
| ------ | -------------- |
| `none` | `rounded-none` |
| `sm`   | `rounded-sm`   |
| `md`   | `rounded-md`   |
| `lg`   | `rounded-lg`   |
| `full` | `rounded-full` |

---

## Sombras

| Valor  | Clase CSS     |
| ------ | ------------- |
| `none` | `shadow-none` |
| `sm`   | `shadow-sm`   |
| `md`   | `shadow-md`   |
| `lg`   | `shadow-lg`   |
| `xl`   | `shadow-xl`   |

---

## Tipografía

### `fontWeight`

| Valor      | Clase CSS       |
| ---------- | --------------- |
| `light`    | `font-light`    |
| `normal`   | `font-normal`   |
| `medium`   | `font-medium`   |
| `bold`     | `font-bold`     |
| `semibold` | `font-semibold` |

### `textStyle`

| Valor      | Comportamiento                                                            |
| ---------- | ------------------------------------------------------------------------- |
| `normal`   | Texto con salto de línea normal (`break-words`)                           |
| `truncate` | Texto truncado con `…` si desborda (`text-ellipsis`, `whitespace-nowrap`) |
| `nowrap`   | Texto en una sola línea sin truncar (`whitespace-nowrap`)                 |

---

## Estado de carga

Cuando `loading={true}`:

- Se renderiza un `SpinnerIcon` SVG animado centrado sobre el botón (posición absoluta).
- El contenido original (texto e íconos) se vuelve invisible (`opacity-0`) pero conserva su espacio, manteniendo el tamaño del botón estable.
- El botón queda deshabilitado (`disabled` + `aria-busy="true"`) y muestra `cursor: not-allowed`.

```jsx
<Button loading>Guardando...</Button>
```

---

## Ref

El componente acepta `ref` y lo propaga al elemento `<button>` nativo, útil para enfocar el botón programáticamente.

```jsx
const btnRef = useRef(null)

<Button ref={btnRef}>Enviar</Button>

// Enfocarlo:
btnRef.current.focus()
```

---

## Accesibilidad

- Propaga `aria-label` al `<button>` nativo (útil para botones solo con ícono).
- Agrega `aria-busy="true"` automáticamente durante el estado de carga.
- El atributo `disabled` se activa tanto con `disabled={true}` como con `loading={true}`.

```jsx
// Botón solo con ícono, accesible
<Button ariaLabel="Eliminar registro" variant="error">
  <TrashIcon />
</Button>
```

---

## Ejemplos

### Con íconos

```jsx
import { Download, ArrowRight } from 'lucide-react'

<Button startIcon={<Download />} variant="primary">
  Descargar
</Button>

<Button endIcon={<ArrowRight />} variant="primary" size="large">
  Continuar
</Button>
```

### Botón de ancho completo con carga

```jsx
<Button fullWidth loading variant="success" size="large">
  Procesando pago...
</Button>
```

### Variante link con texto truncado

```jsx
<Button variant="link" textStyle="truncate" className="rui:max-w-[200px]">
  Ir a la sección de configuración avanzada
</Button>
```

### Ghost con bordes redondeados y sin sombra

```jsx
<Button variant="ghost" rounded="full" shadow="none">
  Cancelar
</Button>
```

# ButtonDropdown

Componente de menú desplegable para React que envuelve cualquier elemento como disparador y muestra una lista de acciones. Se integra nativamente con el componente `Button` y cierra el menú automáticamente al seleccionar una opción.

---

## Dependencias

```bash
npm install clsx lucide-react
```

El componente requiere:

- `clsx` — composición condicional de clases CSS
- `lucide-react` — ícono `ChevronDown`
- `Button` — componente interno (ver [Integración con Button](#integración-con-button))

---

## Uso básico

```jsx
import { ButtonDropdown } from "react-ui-componentes";
import { Button } from "react-ui-componentes";

<ButtonDropdown trigger={<Button variant="primary">Acciones</Button>}>
  <Button variant="ghost" onClick={() => console.log("Editar")}>
    Editar
  </Button>
  <Button variant="ghost" onClick={() => console.log("Duplicar")}>
    Duplicar
  </Button>
  <Button variant="error" onClick={() => console.log("Eliminar")}>
    Eliminar
  </Button>
</ButtonDropdown>;
```

---

## Props

| Prop        | Tipo        | Por defecto     | Descripción                                                               |
| ----------- | ----------- | --------------- | ------------------------------------------------------------------------- |
| `trigger`   | `ReactNode` | —               | **Requerido.** Elemento que abre/cierra el dropdown al hacer clic         |
| `children`  | `ReactNode` | —               | Contenido del menú. Ver [Integración con Button](#integración-con-button) |
| `position`  | `string`    | `'bottom-left'` | Posición del menú relativa al disparador. Ver [Posiciones](#posiciones)   |
| `className` | `string`    | `''`            | Clases CSS adicionales para el contenedor externo                         |

---

## Posiciones

| Valor          | Descripción                                 |
| -------------- | ------------------------------------------- |
| `bottom-left`  | Debajo del trigger, alineado a la izquierda |
| `bottom-right` | Debajo del trigger, alineado a la derecha   |
| `top-left`     | Sobre el trigger, alineado a la izquierda   |
| `top-right`    | Sobre el trigger, alineado a la derecha     |

---

## Integración con Button

Cuando los `children` son componentes `Button`, el componente los clona automáticamente aplicando:

- `fullWidth: true` — el botón ocupa el ancho completo del menú.
- `justify-start` — el texto e íconos se alinean a la izquierda.
- Un `onClick` que ejecuta el handler original **y luego cierra el menú**.

Cualquier otro tipo de elemento (no `Button`) se renderiza tal cual, sin modificaciones.

---

## Comportamiento del trigger

El componente acepta cualquier `ReactElement` como `trigger` y lo clona añadiendo:

| Propiedad añadida | Valor                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `ref`             | Referencia interna para medir el ancho                                                              |
| `onClick`         | Función que alterna la apertura del menú                                                            |
| `aria-haspopup`   | `"true"`                                                                                            |
| `aria-expanded`   | `true` / `false` según el estado del menú                                                           |
| `endIcon`         | `ChevronDown` rotado 180° cuando el menú está abierto (solo si el trigger no tiene ya un `endIcon`) |
| `tabIndex`        | `0`                                                                                                 |
| `id`              | Usa el `id` del trigger si existe, o `'button-dropdown-trigger'`                                    |

Si `trigger` no es un elemento React válido, se renderiza un botón de fallback con estilos básicos.

---

## Ancho del menú

El menú adopta automáticamente el ancho del trigger como `minWidth` al abrirse. Esto garantiza que el dropdown no sea más estrecho que el botón que lo abre.

Si el trigger tiene `fullWidth={true}`, el `maxWidth` del menú también se limita al 100% del contenedor.

---

## Animación

El menú aparece y desaparece con una transición de `200ms` que combina escala (`scale-95` → `scale-100`) y opacidad (`opacity-0` → `opacity-100`). El `transform-origin` varía según la posición para que la animación nazca desde el borde correcto:

| Posición       | Origin                |
| -------------- | --------------------- |
| `bottom-left`  | `origin-top-left`     |
| `bottom-right` | `origin-top-right`    |
| `top-left`     | `origin-bottom-left`  |
| `top-right`    | `origin-bottom-right` |

---

## Cierre automático

El menú se cierra en los siguientes casos:

- Al hacer clic en cualquier elemento `Button` hijo.
- Al hacer clic fuera del componente (`mousedown` en el `document`).

---

## Accesibilidad

- El contenedor del menú tiene `role="menu"` y `aria-orientation="vertical"`.
- Está vinculado al trigger mediante `aria-labelledby` usando el `id` del trigger.
- El trigger recibe `aria-haspopup="true"` y `aria-expanded` sincronizado con el estado.
- El panel del menú tiene `tabIndex="-1"` para permitir el foco programático si fuera necesario.

---

## Ejemplos

### Alineado a la derecha

```jsx
<ButtonDropdown
  trigger={<Button variant="ghost">Opciones</Button>}
  position="bottom-right"
>
  <Button variant="ghost" onClick={handleEdit}>
    Editar
  </Button>
  <Button variant="ghost" onClick={handleShare}>
    Compartir
  </Button>
  <Button variant="error" onClick={handleDelete}>
    Eliminar
  </Button>
</ButtonDropdown>
```

### Ancho completo

```jsx
<ButtonDropdown
  trigger={
    <Button variant="primary" fullWidth>
      Seleccionar estado
    </Button>
  }
  position="bottom-left"
>
  <Button variant="success" onClick={() => setStatus("activo")}>
    Activo
  </Button>
  <Button variant="warning" onClick={() => setStatus("pausado")}>
    Pausado
  </Button>
  <Button variant="error" onClick={() => setStatus("inactivo")}>
    Inactivo
  </Button>
</ButtonDropdown>
```

### Menú que abre hacia arriba

```jsx
<ButtonDropdown
  trigger={<Button variant="primary">Más acciones</Button>}
  position="top-left"
>
  <Button variant="ghost" onClick={handleExport}>
    Exportar CSV
  </Button>
  <Button variant="ghost" onClick={handlePrint}>
    Imprimir
  </Button>
</ButtonDropdown>
```

### Con contenido mixto (no solo Buttons)

```jsx
<ButtonDropdown trigger={<Button>Perfil</Button>}>
  <div className="px-3 py-2 text-xs text-gray-400">usuario@email.com</div>
  <Button variant="ghost" onClick={goToProfile}>
    Mi perfil
  </Button>
  <Button variant="ghost" onClick={goToSettings}>
    Configuración
  </Button>
  <hr className="my-1 border-gray-200" />
  <Button variant="error" onClick={handleLogout}>
    Cerrar sesión
  </Button>
</ButtonDropdown>
```

> Los elementos que no son `Button` (como `<div>` o `<hr>`) se renderizan sin modificaciones.

# CheckBox

Componente de casilla de verificación para React. Soporta múltiples variantes de color, posición del label, estado de error, deshabilitado y control externo del valor.

---

## Dependencias

```bash
npm install clsx
```

El componente utiliza:

- `react` (`forwardRef`)
- `clsx` — composición condicional de clases CSS
- `useId` — hook interno para generar IDs únicos y accesibles

---

## Uso básico

```jsx
import { CheckBox } from "react-ui-componentes"

const [checked, setChecked] = useState(false)

<CheckBox
  label="Acepto los términos y condiciones"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

---

## Props

| Prop            | Tipo       | Por defecto | Descripción                                                                          |
| --------------- | ---------- | ----------- | ------------------------------------------------------------------------------------ |
| `checked`       | `boolean`  | —           | Estado controlado de la casilla                                                      |
| `onChange`      | `function` | —           | Callback al cambiar el estado. Recibe el evento nativo del input                     |
| `label`         | `string`   | `''`        | Texto visible junto a la casilla. Si está vacío, no se renderiza el label            |
| `labelPosition` | `string`   | `'right'`   | Posición del label respecto a la casilla: `'right'` o `'left'`                       |
| `variant`       | `string`   | `'primary'` | Color del acento y borde de foco. Ver [Variantes](#variantes)                        |
| `disabled`      | `boolean`  | `false`     | Deshabilita la casilla y aplica estilos de opacidad reducida                         |
| `name`          | `string`   | `''`        | Atributo `name` del input nativo, útil en formularios                                |
| `errorMessage`  | `string`   | `''`        | Mensaje de error visible bajo la casilla. Activa automáticamente la variante `error` |
| `fullWidth`     | `boolean`  | `false`     | Expande el contenedor al 100% del ancho disponible                                   |
| `style`         | `object`   | —           | Estilos en línea para el contenedor externo                                          |
| `className`     | `string`   | `''`        | Clases CSS adicionales para el contenedor externo                                    |
| `...rest`       | —          | —           | Atributos HTML adicionales propagados al elemento `<input type="checkbox">`          |

---

## Variantes

La variante controla el color de `accentColor` (el relleno de la casilla cuando está marcada) y el borde al enfocar, mediante CSS custom properties.

| Variante     | Variable CSS de acento | Variable CSS de borde |
| ------------ | ---------------------- | --------------------- |
| `primary`    | `--primary-focus`      | `--primary-border`    |
| `success`    | `--success-focus`      | `--success-border`    |
| `warning`    | `--warning-focus`      | `--warning-border`    |
| `error`      | `--error-focus`        | `--error-border`      |

> Cuando `errorMessage` tiene contenido, la variante activa se sobreescribe automáticamente a `error`, independientemente del valor de `variant`.

---

## Estado de error

Al pasar `errorMessage`, el componente:

- Cambia la variante activa a `error`.
- Muestra el mensaje en rojo bajo la casilla.
- Aplica `aria-invalid="true"` al input.
- Vincula el mensaje al input mediante `aria-describedby`.

```jsx
<CheckBox
  label="Debes aceptar para continuar"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
  errorMessage={!accepted ? "Este campo es obligatorio" : ""}
/>
```

> El espacio para el mensaje de error siempre está reservado (`h-1`) para evitar saltos de layout.

---

## Posición del label

| Valor     | Resultado                                  |
| --------- | ------------------------------------------ |
| `'right'` | Label a la derecha de la casilla (default) |
| `'left'`  | Label a la izquierda de la casilla         |

```jsx
<CheckBox
  label="Notificaciones"
  labelPosition="left"
  checked={checked}
  onChange={onChange}
/>
```

---

## Ref

El componente acepta `ref` y lo propaga al elemento `<input>` nativo.

```jsx
const checkRef = useRef(null)

<CheckBox ref={checkRef} label="Recordarme" checked={checked} onChange={onChange} />

// Enfocar programáticamente:
checkRef.current.focus()
```

---

## Accesibilidad

- El `<input>` y el `<label>` están vinculados mediante un `id` único generado por el hook `useId`.
- `aria-invalid="true"` se aplica automáticamente cuando hay `errorMessage`.
- El mensaje de error está referenciado con `aria-describedby` para que los lectores de pantalla lo anuncien.
- El label tiene `cursor: not-allowed` cuando el componente está deshabilitado.

---

## Ejemplos

### Grupo de checkboxes con variantes

```jsx
<CheckBox label="Opción éxito"   variant="success"    checked={a} onChange={(e) => setA(e.target.checked)} />
<CheckBox label="Opción alerta"  variant="warning"    checked={b} onChange={(e) => setB(e.target.checked)} />
<CheckBox label="Opción error"   variant="error"      checked={c} onChange={(e) => setC(e.target.checked)} />
```

### Deshabilitado

```jsx
<CheckBox label="No disponible" checked={false} onChange={() => {}} disabled />
<CheckBox label="Preseleccionado" checked={true} onChange={() => {}} disabled />
```

### Ancho completo con label a la izquierda

```jsx
<CheckBox
  label="Recibir notificaciones por email"
  labelPosition="left"
  fullWidth
  checked={notify}
  onChange={(e) => setNotify(e.target.checked)}
/>
```

### En un formulario con validación

```jsx
const [terms, setTerms] = useState(false)
const [submitted, setSubmitted] = useState(false)

<CheckBox
  label="Acepto los términos y condiciones"
  name="terms"
  checked={terms}
  onChange={(e) => setTerms(e.target.checked)}
  errorMessage={submitted && !terms ? 'Debes aceptar los términos para continuar' : ''}
/>
```

# Container

Componente de layout genérico para React. Envuelve contenido en un bloque con ancho máximo, padding, sombra y bordes redondeados configurables. Soporta renderizado como cualquier elemento HTML mediante la prop `as`.

---

## Dependencias

```bash
npm install clsx
```

El componente utiliza:

- `react` (`forwardRef`)
- `clsx` — composición condicional de clases CSS

---

## Uso básico

```jsx
import { Container } from "react-ui-componentes"

<Container>
  <p>Contenido de la página</p>
</Container>

// Con opciones personalizadas
<Container maxWidth="lg" padding="lg" shadow="sm" rounded="xl">
  <p>Contenido con más espacio</p>
</Container>
```

---

## Props

| Prop        | Tipo             | Por defecto | Descripción                                                        |
| ----------- | ---------------- | ----------- | ------------------------------------------------------------------ |
| `children`  | `ReactNode`      | —           | Contenido a renderizar dentro del contenedor                       |
| `as`        | `elementType`    | `'div'`     | Elemento HTML o componente React usado para el renderizado         |
| `maxWidth`  | `string`         | `'md'`      | Ancho máximo del contenedor. Ver [Anchos máximos](#anchos-máximos) |
| `shadow`    | `string`         | `'md'`      | Sombra del contenedor. Ver [Sombras](#sombras)                     |
| `rounded`   | `string`         | `'md'`      | Radio de borde. Ver [Bordes redondeados](#bordes-redondeados)      |
| `padding`   | `string\|number` | `'md'`      | Padding interno. Ver [Padding](#padding)                           |
| `className` | `string`         | `''`        | Clases CSS adicionales para el contenedor                          |
| `...rest`   | —                | —           | Atributos HTML adicionales propagados al elemento raíz             |

---

## Anchos máximos

| Valor       | Clase CSS          | Referencia aproximada |
| ----------- | ------------------ | --------------------- |
| `sx`        | `max-w-screen-xs`  | ~480px                |
| `sm`        | `max-w-screen-sm`  | ~640px                |
| `md`        | `max-w-screen-md`  | ~768px                |
| `lg`        | `max-w-screen-lg`  | ~1024px               |
| `xl`        | `max-w-screen-xl`  | ~1280px               |
| `2xl`       | `max-w-screen-2xl` | ~1536px               |
| `fullWidth` | `max-w-full`       | Sin límite            |

El contenedor siempre tiene `w-full`, por lo que ocupa todo el espacio disponible hasta alcanzar el `maxWidth`.

---

## Sombras

| Valor  | Clase CSS     |
| ------ | ------------- |
| `none` | `shadow-none` |
| `sm`   | `shadow-sm`   |
| `md`   | `shadow-md`   |
| `lg`   | `shadow-lg`   |
| `xl`   | `shadow-xl`   |

---

## Bordes redondeados

| Valor  | Clase CSS      |
| ------ | -------------- |
| `none` | `rounded-none` |
| `sm`   | `rounded-sm`   |
| `md`   | `rounded-md`   |
| `lg`   | `rounded-lg`   |
| `xl`   | `rounded-xl`   |
| `full` | `rounded-full` |

---

## Padding

| Valor | Clase CSS | Tamaño |
| ----- | --------- | ------ |
| `0`   | `p-0`     | 0px    |
| `sm`  | `p-2`     | 8px    |
| `md`  | `p-4`     | 16px   |
| `lg`  | `p-6`     | 24px   |
| `xl`  | `p-8`     | 32px   |

---

## Prop `as` — renderizado polimórfico

Permite cambiar el elemento HTML raíz sin perder los estilos del componente. Útil para mantener semántica HTML correcta.

```jsx
// Como sección semántica
<Container as="section" maxWidth="lg">
  <h2>Título de sección</h2>
</Container>

// Como artículo
<Container as="article" padding="xl">
  <p>Contenido del artículo</p>
</Container>

// Como elemento <main>
<Container as="main" maxWidth="xl" shadow="none">
  <p>Contenido principal</p>
</Container>
```

---

## Ref

El componente acepta `ref` y lo propaga al elemento raíz renderizado.

```jsx
const containerRef = useRef(null)

<Container ref={containerRef} maxWidth="lg">
  Contenido
</Container>
```

---

## Ejemplos

### Tarjeta básica

```jsx
<Container maxWidth="sm" shadow="lg" rounded="xl" padding="lg">
  <h2>Título de la tarjeta</h2>
  <p>Descripción del contenido.</p>
</Container>
```

### Layout de página sin sombra

```jsx
<Container as="main" maxWidth="xl" shadow="none" rounded="none" padding="xl">
  <h1>Bienvenido</h1>
  <p>Contenido principal de la aplicación.</p>
</Container>
```

### Contenedor sin padding para imágenes

```jsx
<Container maxWidth="lg" padding={0} rounded="lg" shadow="md">
  <img src="/banner.jpg" alt="Banner" className="w-full rounded-lg" />
</Container>
```

### Ancho completo sin restricciones

```jsx
<Container maxWidth="fullWidth" shadow="none" rounded="none" padding="md">
  <p>Se extiende a todo el ancho disponible.</p>
</Container>
```

# DatePicker

Componente de selección de fechas para React. Soporta selección simple, rango de fechas, hora, fechas deshabilitadas, navegación por mes/año/década y múltiples variantes de color. El calendario se renderiza via `createPortal` con posicionamiento inteligente respecto a la ventana.

---

## Dependencias

```bash
npm install clsx lucide-react
```

El componente utiliza:

- `react` (`forwardRef`, `useEffect`, `useMemo`, `useState`, `memo`, `useRef`)
- `react-dom` (`createPortal`) — el calendario se renderiza en `document.body`
- `clsx` — composición condicional de clases CSS
- `lucide-react` — íconos `CalendarIcon`, `ChevronLeft`, `ChevronRight`, `ChevronsLeft`, `ChevronsRight`, `X`

---

## Uso básico

```jsx
import { DatePicker } from "react-ui-componentes"

const [date, setDate] = useState('')

<DatePicker
  label="Fecha de inicio"
  value={date}
  onChange={setDate}
  placeholder="Selecciona una fecha"
/>
```

---

## Props

| Prop            | Tipo              | Por defecto              | Descripción                                                                                |
| --------------- | ----------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `value`         | `string \| array` | —                        | Valor controlado. String ISO para fecha simple; array `[start, end]` para rango            |
| `onChange`      | `function`        | `() => {}`               | Callback al seleccionar. Recibe string ISO o array `[startISO, endISO]`                    |
| `label`         | `string`          | `''`                     | Etiqueta visible sobre el campo                                                            |
| `placeholder`   | `string`          | `'Selecciona una fecha'` | Texto del input cuando no hay valor seleccionado                                           |
| `variant`       | `string`          | `'primary'`              | Color del calendario y selecciones. Ver [Variantes](#variantes)                            |
| `size`          | `string`          | `'medium'`               | Tamaño del input. Ver [Tamaños](#tamaños)                                                  |
| `range`         | `boolean`         | `false`                  | Activa la selección de rango de fechas. Ver [Modo rango](#modo-rango)                      |
| `rangeDays`     | `number`          | `null`                   | Límite máximo de días seleccionables en modo rango                                         |
| `showTime`      | `boolean`         | `false`                  | Muestra el selector de hora junto al calendario. Ver [Selector de hora](#selector-de-hora) |
| `disabledDates` | `array`           | `[]`                     | Array de fechas ISO deshabilitadas. Ver [Fechas deshabilitadas](#fechas-deshabilitadas)    |
| `disabled`      | `boolean`         | `false`                  | Deshabilita todo el componente                                                             |
| `errorMessage`  | `string`          | `''`                     | Mensaje de error bajo el campo; activa automáticamente la variante `error`                 |
| `className`     | `string`          | `''`                     | Clases CSS adicionales para el contenedor externo                                          |

---

## Formatos de valor

Todas las fechas se manejan internamente en **UTC** para evitar inconsistencias de zona horaria.

**Fecha simple (`range={false}`):**

```
"2024-03-15"           // solo fecha
"2024-03-15T10:30:00Z" // fecha y hora (cuando showTime=true)
```

**Rango de fechas (`range={true}`):**

```js
["2024-03-10", "2024-03-20"][("2024-03-10T08:00:00Z", "2024-03-20T17:30:00Z")]; // con hora
```

El input visible muestra las fechas en formato `dd/mm/aaaa` (o `dd/mm/aaaa hh:mm` con `showTime`).

---

## Variantes

Controlan los colores de selección, hover y borde de foco mediante CSS custom properties.

| Variante     | Variables CSS base                                 |
| ------------ | -------------------------------------------------- |
| `primary`    | `--primary-bg`, `--primary-selected-bg/text`       |
| `success`    | `--success-bg`, `--success-selected-bg/text`       |
| `warning`    | `--warning-bg`, `--warning-selected-bg/text`       |
| `error`      | `--error-bg`, `--error-selected-bg/text`           |

> Cuando `errorMessage` tiene contenido, la variante activa se sobreescribe a `error` automáticamente.

---

## Tamaños

| Valor    | Altura | Fuente (desktop)   |
| -------- | ------ | ------------------ |
| `small`  | 32px   | `text-xs` (12px)   |
| `medium` | 36px   | `text-sm` (14px)   |
| `large`  | 40px   | `text-base` (16px) |

> En móvil el input siempre usa `text-[16px]` para evitar el zoom automático del navegador en iOS.

---

## Modo rango

Con `range={true}` el componente muestra **dos calendarios** lado a lado (apilados en mobile, en fila en desktop). La selección funciona en dos clics:

1. Primer clic → establece la fecha de inicio.
2. Segundo clic → establece la fecha de fin y confirma el rango.

Al pasar el cursor entre clics se muestra una previsualización del rango en hover.

```jsx
const [range, setRange] = useState([])

<DatePicker
  range
  value={range}
  onChange={setRange}
  label="Período"
/>
```

### Límite de días (`rangeDays`)

Restringe el rango máximo seleccionable. Si el usuario intenta seleccionar más días, la fecha de fin se recorta automáticamente.

```jsx
<DatePicker
  range
  rangeDays={30}
  value={range}
  onChange={setRange}
  label="Máximo 30 días"
/>
```

---

## Selector de hora

Con `showTime={true}` aparece un panel lateral de hora junto a cada calendario, con columnas de horas (0–23) y minutos (0–59) con scroll suave. La selección se confirma al elegir los minutos.

```jsx
<DatePicker
  showTime
  value={datetime}
  onChange={setDatetime}
  label="Fecha y hora"
  placeholder="dd/mm/aaaa hh:mm"
/>
```

En modo rango con `showTime`, cada calendario tiene su propio panel de hora (inicio y fin independientes).

---

## Fechas deshabilitadas

Acepta un array de strings en formato ISO. Los días deshabilitados se muestran con opacidad reducida y no son seleccionables.

```jsx
<DatePicker
  disabledDates={["2024-12-25", "2024-12-31", "2025-01-01"]}
  value={date}
  onChange={setDate}
  label="Disponibilidad"
/>
```

---

## Navegación del calendario

El encabezado del calendario permite tres modos de vista que se activan haciendo clic en el título:

| Vista   | Título muestra           | Permite seleccionar |
| ------- | ------------------------ | ------------------- |
| `date`  | Mes y año (`Marzo 2024`) | Días del mes        |
| `month` | Año (`2024`)             | Mes del año         |
| `year`  | Década (`2020 - 2029`)   | Año                 |

Los botones de navegación `‹` / `›` avanzan un paso (mes/año/década) y `«` / `»` avanzan un paso mayor. En modo rango, los dos calendarios se mantienen sincronizados para que el izquierdo siempre sea anterior al derecho.

---

## Posicionamiento del calendario

El popup se renderiza vía `createPortal` en `document.body` y se posiciona dinámicamente:

- Se abre justo debajo del input con 8px de separación.
- Si el popup desborda el borde derecho de la ventana, se desplaza a la izquierda automáticamente.
- Se actualiza en tiempo real al hacer scroll o redimensionar la ventana.
- Se cierra al hacer clic fuera del componente.

---

## Limpieza del valor

El input muestra un botón `✕` (con animación de rotación al hover) cuando hay un valor seleccionado. Al hacer clic se limpia el valor y se llama a `onChange('')`.

---

## Accesibilidad

- El calendario en modo fecha usa `role="grid"` en la cuadrícula de días.
- Los días deshabilitados tienen `cursor: not-allowed` y no responden a clicks ni hover.
- El input tiene `readOnly` e `inputMode="none"` para evitar el teclado en móvil.

---

## Ejemplos

### Fecha simple con error

```jsx
const [date, setDate] = useState('')
const [submitted, setSubmitted] = useState(false)

<DatePicker
  label="Fecha de nacimiento"
  value={date}
  onChange={setDate}
  errorMessage={submitted && !date ? 'La fecha es obligatoria' : ''}
  variant="primary"
/>
```

### Rango con límite de días

```jsx
const [range, setRange] = useState([])

<DatePicker
  range
  rangeDays={14}
  label="Período de vacaciones (máx. 14 días)"
  value={range}
  onChange={setRange}
  variant="primary"
  size="large"
/>
```

### Selección de fecha y hora

```jsx
const [datetime, setDatetime] = useState('')

<DatePicker
  showTime
  label="Fecha y hora de la reunión"
  value={datetime}
  onChange={setDatetime}
  placeholder="dd/mm/aaaa hh:mm"
  variant="success"
/>
```

### Rango con hora y fechas deshabilitadas

```jsx
const holidays = ['2024-12-25', '2024-12-26', '2025-01-01']

<DatePicker
  range
  showTime
  disabledDates={holidays}
  label="Período de reserva"
  value={reservationRange}
  onChange={setReservationRange}
  variant="success"
/>
```

# Drawer

Componente de panel deslizante para React. Se abre desde cualquiera de los cuatro bordes de la pantalla, renderizado via `createPortal` sobre el resto del contenido. Incluye backdrop con blur, cierre por tecla `Escape`, animaciones de entrada/salida y control del scroll del body.

---

## Dependencias

```bash
npm install clsx lucide-react
```

El componente utiliza:

- `react` (`useEffect`, `useRef`, `useCallback`, `useState`)
- `react-dom` (`createPortal`) — se renderiza directamente en `document.body`
- `clsx` — composición condicional de clases CSS
- `lucide-react` — ícono `X` para el botón de cierre

---

## Uso básico

```jsx
import { Drawer } from "react-ui-componentes"

const [open, setOpen] = useState(false)

<button onClick={() => setOpen(true)}>Abrir panel</button>

<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Detalles"
>
  <p>Contenido del drawer.</p>
</Drawer>
```

---

## Props

| Prop                  | Tipo        | Por defecto | Descripción                                                         |
| --------------------- | ----------- | ----------- | ------------------------------------------------------------------- |
| `isOpen`              | `boolean`   | —           | **Requerido.** Controla si el drawer está abierto                   |
| `onClose`             | `function`  | —           | **Requerido.** Callback para cerrar el drawer                       |
| `title`               | `string`    | —           | Texto del encabezado del panel                                      |
| `children`            | `ReactNode` | —           | Contenido del cuerpo del drawer                                     |
| `placement`           | `string`    | `'right'`   | Lado desde donde aparece el drawer. Ver [Posiciones](#posiciones)   |
| `size`                | `string`    | `'md'`      | Ancho (lateral) o alto (superior/inferior). Ver [Tamaños](#tamaños) |
| `closeOnOverlayClick` | `boolean`   | `true`      | Si `true`, hacer clic en el backdrop llama a `onClose`              |
| `overflowY`           | `boolean`   | `true`      | Habilita scroll vertical en el cuerpo del drawer                    |
| `className`           | `string`    | `''`        | Clases CSS adicionales para el panel del drawer                     |

---

## Posiciones

| Valor    | Descripción                        | Animación de entrada      |
| -------- | ---------------------------------- | ------------------------- |
| `right`  | Desliza desde la derecha (default) | `translateX(100%)` → `0`  |
| `left`   | Desliza desde la izquierda         | `translateX(-100%)` → `0` |
| `top`    | Desliza desde arriba               | `translateY(-100%)` → `0` |
| `bottom` | Desliza desde abajo                | `translateY(100%)` → `0`  |

---

## Tamaños

El tamaño controla el **ancho máximo** para drawers laterales (`left`/`right`) o el **alto máximo** para drawers verticales (`top`/`bottom`).

| Valor  | Lateral (`left`/`right`) | Vertical (`top`/`bottom`) |
| ------ | ------------------------ | ------------------------- |
| `md`   | `max-w-md` (~448px)      | `max-h-[30vh]`            |
| `lg`   | `max-w-lg` (~512px)      | `max-h-[40vh]`            |
| `xl`   | `max-w-xl` (~576px)      | `max-h-[50vh]`            |
| `2xl`  | `max-w-2xl` (~672px)     | `max-h-[60vh]`            |
| `3xl`  | `max-w-3xl` (~768px)     | `max-h-[70vh]`            |
| `4xl`  | `max-w-4xl` (~896px)     | `max-h-[80vh]`            |
| `5xl`  | `max-w-5xl` (~1024px)    | `max-h-[90vh]`            |
| `full` | `max-w-full`             | `max-h-full`              |

---

## Animación y ciclo de vida

El drawer usa dos estados internos para garantizar que la animación de salida se complete antes de desmontar el panel:

- **`shouldRender`** — determina si el componente existe en el DOM.
- **`isMounted`** — activa las clases de visibilidad y posición para la transición CSS.

| Evento          | `shouldRender` | `isMounted`           | Efecto visual               |
| --------------- | -------------- | --------------------- | --------------------------- |
| `isOpen: true`  | `true`         | `true` (10ms después) | Panel desliza hacia adentro |
| `isOpen: false` | `true`         | `false`               | Panel desliza hacia afuera  |
| 300ms después   | `false`        | `false`               | Panel se desmonta del DOM   |

La duración de la transición es `300ms` tanto en la entrada como en la salida.

---

## Backdrop

El fondo oscuro que cubre el resto de la pantalla incluye:

- Fondo negro al 50% de opacidad (`bg-black/50`).
- Efecto de desenfoque (`backdrop-blur-sm`).
- Transición de opacidad de `300ms` sincronizada con el panel.
- `cursor: pointer` cuando `closeOnOverlayClick={true}`, y `cursor: default` cuando es `false`.

---

## Cierre por teclado

Mientras el drawer está abierto, se registra un listener `keydown` en el documento. Al presionar `Escape` se llama a `onClose`. El listener se desregistra automáticamente al cerrar o desmontar.

---

## Bloqueo de scroll

Mientras el drawer está abierto se aplica `document.body.style.overflow = 'hidden'` para evitar el scroll de la página de fondo. Se restaura a `'unset'` al cerrar.

---

## Estructura del panel

El panel está dividido en dos secciones fijas:

**Encabezado** — siempre visible, separado con `border-b`:

- Título (`h3`) con `truncate` para textos largos.
- Botón de cierre con ícono `X` y `aria-label="Cerrar"`.

**Cuerpo** — ocupa el espacio restante con `flex-1`:

- Scroll vertical habilitado por defecto (`overflowY={true}`).
- Renderiza `children` directamente con padding de `p-4`.

---

## Accesibilidad

- El botón de cierre tiene `aria-label="Cerrar"`.
- El drawer se cierra con `Escape` sin necesidad de interacción con el ratón.
- No se renderiza nada en SSR (`typeof document === 'undefined'` retorna `null`).

---

## Ejemplos

### Desde la izquierda, tamaño grande

```jsx
<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Menú de navegación"
  placement="left"
  size="lg"
>
  <nav>
    <a href="/inicio">Inicio</a>
    <a href="/productos">Productos</a>
  </nav>
</Drawer>
```

### Desde abajo, sin cierre por overlay

```jsx
<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirmar acción"
  placement="bottom"
  size="md"
  closeOnOverlayClick={false}
>
  <p>¿Estás seguro de que deseas continuar?</p>
  <button onClick={() => setOpen(false)}>Cancelar</button>
  <button onClick={handleConfirm}>Confirmar</button>
</Drawer>
```

### Contenido largo con scroll

```jsx
<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Términos y condiciones"
  size="xl"
  overflowY={true}
>
  {Array.from({ length: 50 }, (_, i) => (
    <p key={i}>Párrafo {i + 1} de los términos...</p>
  ))}
</Drawer>
```

### Sin scroll en el cuerpo (contenido de altura fija)

```jsx
<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Mapa"
  size="2xl"
  overflowY={false}
>
  <div style={{ height: "100%" }}>
    <MapComponent />
  </div>
</Drawer>
```

# FileUpload

FileUpload allows users to select and manage files through file browsing or drag-and-drop interactions.

## Import

```jsx
import { FileUpload } from "react-ui-componentes";
```

## Usage

```jsx
<FileUpload label="Upload file" onFilesSelect={(files) => console.log(files)} />
```

## Multiple Files

Use the `multiple` prop to allow selecting more than one file.

```jsx
<FileUpload multiple onFilesSelect={(files) => console.log(files)} />
```

## Accepted File Types

Restrict selectable file types using the `accept` prop.

```jsx
<FileUpload accept="image/*,.pdf" onFilesSelect={(files) => console.log(files)} />
```

## Drag and Drop

Files can be selected either by clicking the upload area or by dragging and dropping them into the component.

```jsx
<FileUpload multiple accept="image/*" />
```

## Disabled

Disable user interaction.

```jsx
<FileUpload disabled />
```

## Error State

Display validation or upload errors.

```jsx
<FileUpload errorMessage="Invalid file format" />
```

## Preview Images

Image files can be previewed automatically after selection.

```jsx
<FileUpload accept="image/*" />
```

## Props

| Prop          | Type                    | Default | Description                           |
| ------------- | ----------------------- | ------- | ------------------------------------- |
| label         | string                  | -       | Label displayed above the upload area |
| multiple      | boolean                 | false   | Allows multiple file selection        |
| accept        | string                  | -       | Accepted file types                   |
| disabled      | boolean                 | false   | Disables interaction                  |
| errorMessage  | string                  | -       | Displays an error message             |
| className     | string                  | -       | Additional CSS classes                |
| onFilesSelect | (files: File[]) => void | -       | Triggered when files are selected     |

## Ref Methods

The component exposes the following methods through `ref`.

### open

Programmatically opens the file picker.

```jsx
uploadRef.current.open();
```

### clear

Removes all selected files.

```jsx
uploadRef.current.clear();
```

## Accessibility

- Supports keyboard navigation.
- Compatible with screen readers.
- Uses semantic form controls.
- Associates labels automatically.
- Provides accessible error messaging.

## Examples

### Basic Upload

```jsx
<FileUpload label="Upload document" />
```

### Image Upload

```jsx
<FileUpload accept="image/*" multiple />
```

### Documents Only

```jsx
<FileUpload accept=".pdf,.doc,.docx" />
```

# InputText

InputText allows users to enter and edit text.

## Import

```jsx
import { InputText } from "react-ui-componentes";
```

## Usage

```jsx
<InputText placeholder="Enter your name" />
```

## Label

Use the `label` prop to display a label associated with the input.

```jsx
<InputText label="Full Name" placeholder="Enter your name" />
```

## Variants

### Primary

Default appearance.

```jsx
<InputText variant="primary" />
```

### Success

Used to indicate a successful state.

```jsx
<InputText variant="success" />
```

### Warning

Used to indicate a warning state.

```jsx
<InputText variant="warning" />
```

### Error

Used when validation fails.

```jsx
<InputText errorMessage="This field is required" />
```

## Sizes

### Small

```jsx
<InputText size="small" />
```

### Medium

Default size.

```jsx
<InputText size="medium" />
```

### Large

```jsx
<InputText size="large" />
```

## Full Width

Use `fullWidth` to make the component occupy the full width of its container.

```jsx
<InputText fullWidth />
```

## Disabled

Prevent user interaction.

```jsx
<InputText disabled />
```

## Input Types

Supports all standard HTML input types.

### Text

```jsx
<InputText type="text" />
```

### Email

```jsx
<InputText type="email" />
```

### Password

```jsx
<InputText type="password" />
```

### Number

```jsx
<InputText type="number" />
```

## Left Icon

Display an icon before the input content.

```jsx
<InputText iconLeft={<Search />} />
```

## Right Icon

Display an icon after the input content.

```jsx
<InputText iconRight={<Mail />} />
```

## Clearable

Display a button that clears the current value.

```jsx
<InputText isClearable />
```

## Controlled Input

```jsx
const [value, setValue] = useState('')

<InputText
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## Uncontrolled Input

```jsx
<InputText defaultValue="John Doe" />
```

## Props

| Prop         | Type      | Default | Description                         |
| ------------ | --------- | ------- | ----------------------------------- |
| label        | string    | -       | Label displayed above the input     |
| placeholder  | string    | -       | Placeholder text                    |
| value        | string    | -       | Controlled value                    |
| defaultValue | string    | -       | Initial value for uncontrolled mode |
| type         | string    | text    | HTML input type                     |
| size         | string    | medium  | Component size                      |
| variant      | string    | primary | Visual variant                      |
| fullWidth    | boolean   | false   | Expands to container width          |
| disabled     | boolean   | false   | Disables interaction                |
| errorMessage | string    | -       | Displays validation errors          |
| iconLeft     | ReactNode | -       | Icon displayed before content       |
| iconRight    | ReactNode | -       | Icon displayed after content        |
| isClearable  | boolean   | false   | Displays a clear button             |
| className    | string    | -       | Additional CSS classes              |
| onChange     | function  | -       | Called when value changes           |

## Ref

The component forwards a reference to the native HTML input element.

```jsx
const inputRef = useRef(null)

<InputText ref={inputRef} />

inputRef.current.focus()
```

## Accessibility

- Supports keyboard navigation.
- Compatible with screen readers.
- Associates labels automatically.
- Supports disabled and error states.
- Uses semantic HTML input elements.

## Examples

### Search Input

```jsx
<InputText placeholder="Search..." iconLeft={<Search />} />
```

### Email Input

```jsx
<InputText type="email" label="Email Address" />
```

### Input with Validation

```jsx
<InputText label="Username" errorMessage="Username is required" />
```

# InputRichText

InputRichText allows users to create and edit rich text content with formatting, lists, headings, code blocks, quotes, alignment, and highlighting.

## Import

```jsx
import { InputRichText } from "react-ui-componentes";
```

## Usage

```jsx
<InputRichText value={content} onChange={setContent} />
```

## Controlled Value

The editor works as a controlled component.

```jsx
const [content, setContent] = useState('')

<InputRichText
  value={content}
  onChange={setContent}
/>
```

## Label

Display a label above the editor.

```jsx
<InputRichText label="Description" />
```

## Placeholder

Display placeholder text when the editor is empty.

```jsx
<InputRichText placeholder="Start writing..." />
```

## Variants

### Primary

Default appearance.

```jsx
<InputRichText variant="primary" />
```

### Success

```jsx
<InputRichText variant="success" />
```

### Warning

```jsx
<InputRichText variant="warning" />
```

### Error

```jsx
<InputRichText variant="error" />
```

## Full Width

Expand the editor to the width of its container.

```jsx
<InputRichText fullWidth />
```

## Error State

Display validation errors.

```jsx
<InputRichText errorMessage="Content is required" />
```

## Disabled

Prevent editing and dim the toolbar.

```jsx
<InputRichText disabled value={content} />
```

## Editor Height

Configure minimum and maximum editor height.

```jsx
<InputRichText minHeight="250px" maxHeight="500px" />
```

## Formatting Tools

The editor includes the following formatting options:

### Text Formatting

- Bold
- Italic
- Underline
- Highlight

### Headings

- Heading 2
- Heading 3

### Lists

- Bulleted List
- Numbered List

### Alignment

- Left
- Center
- Right

### Advanced Formatting

- Code Blocks
- Blockquotes

### History

- Undo
- Redo

## Keyboard Shortcuts

| Shortcut         | Action     |
| ---------------- | ---------- |
| Ctrl + B         | Bold       |
| Ctrl + I         | Italic     |
| Ctrl + U         | Underline  |
| Ctrl + Z         | Undo       |
| Ctrl + Shift + Z | Redo       |
| Ctrl + Y         | Redo       |
| Ctrl + `         | Code Block |

## Props

| Prop         | Type     | Default            | Description                  |
| ------------ | -------- | ------------------ | ---------------------------- |
| value        | string   | ''                 | Editor content               |
| onChange     | function | -                  | Called when content changes  |
| label        | string   | -                  | Label displayed above editor |
| placeholder  | string   | "Start writing..." | Placeholder text             |
| variant      | string   | primary            | Visual variant               |
| fullWidth    | boolean  | false              | Expands to container width   |
| minHeight    | string   | 200px              | Minimum editor height        |
| maxHeight    | string   | 400px              | Maximum editor height        |
| errorMessage | string   | -                  | Displays validation errors   |
| disabled     | boolean  | false              | Prevents editing             |
| className    | string   | -                  | Additional CSS classes       |

## Ref

The component forwards a reference to the editable content element.

```jsx
const editorRef = useRef(null)

<InputRichText ref={editorRef} />
```

## Accessibility

- Supports keyboard navigation.
- Compatible with screen readers.
- Supports semantic headings.
- Supports ordered and unordered lists.
- Provides accessible error messages.
- Preserves focus during toolbar interactions.

## Examples

### Article Editor

```jsx
<InputRichText
  label="Article Content"
  placeholder="Write your article..."
  value={content}
  onChange={setContent}
/>
```

### Blog Post Editor

```jsx
<InputRichText minHeight="300px" maxHeight="600px" />
```

### Required Content

```jsx
<InputRichText label="Description" errorMessage="Description is required" />
```

# Modal

Modal displays content in a layer above the application interface and requires user interaction before returning to the main workflow.

## Import

```jsx
import { Modal } from "react-ui-componentes";
```

## Usage

```jsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmation">
  Modal content
</Modal>
```

## Sizes

Control the maximum width of the modal using the `size` prop.

### Small

```jsx
<Modal size="sm" />
```

### Medium

```jsx
<Modal size="md" />
```

### Large

```jsx
<Modal size="lg" />
```

### Extra Large

```jsx
<Modal size="xl" />
```

### 2XL

```jsx
<Modal size="2xl" />
```

### 3XL

```jsx
<Modal size="3xl" />
```

### 4XL

```jsx
<Modal size="4xl" />
```

### 5XL

```jsx
<Modal size="5xl" />
```

### 6XL

```jsx
<Modal size="6xl" />
```

### 7XL

```jsx
<Modal size="7xl" />
```

### Full Width

```jsx
<Modal size="full" />
```

## Title

Display a title in the modal header.

```jsx
<Modal title="User Details" isOpen={isOpen} onClose={handleClose}>
  Content
</Modal>
```

## Close on Overlay Click

By default, clicking outside the modal closes it.

```jsx
<Modal closeOnOverlayClick={true} />
```

Disable this behavior if required.

```jsx
<Modal closeOnOverlayClick={false} />
```

## Scrollable Content

Enable vertical scrolling when displaying large amounts of content.

```jsx
<Modal overflowY>Long content...</Modal>
```

## Custom Styling

Apply additional styles using the `className` prop.

```jsx
<Modal className="custom-modal">Content</Modal>
```

## Props

| Prop                | Type      | Default | Description                    |
| ------------------- | --------- | ------- | ------------------------------ |
| isOpen              | boolean   | false   | Controls modal visibility      |
| onClose             | function  | -       | Called when the modal closes   |
| title               | string    | -       | Modal header title             |
| children            | ReactNode | -       | Modal content                  |
| size                | string    | lg      | Maximum modal width            |
| closeOnOverlayClick | boolean   | true    | Closes when overlay is clicked |
| overflowY           | boolean   | false   | Enables vertical scrolling     |
| variant             | string    | primary | Visual variant                 |
| className           | string    | -       | Additional CSS classes         |

## Keyboard Support

The modal supports keyboard interactions.

| Key    | Action      |
| ------ | ----------- |
| Escape | Close modal |

## Accessibility

- Supports keyboard navigation.
- Closes with the Escape key.
- Prevents background page scrolling while open.
- Renders above application content using a portal.
- Provides a dedicated close button.
- Supports focusable interactive elements inside the modal.

## Examples

### Confirmation Dialog

```jsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete Item">
  Are you sure you want to delete this item?
</Modal>
```

### Large Content Modal

```jsx
<Modal size="4xl" overflowY title="Terms and Conditions">
  ...
</Modal>
```

### Full Screen Modal

```jsx
<Modal size="full" title="Dashboard">
  ...
</Modal>
```

# Select

Componente de selección desplegable con soporte para selección simple y múltiple, variantes de color, tamaños configurables y renderizado del dropdown vía portal.

---

## Importación

```jsx
import { Select } from "react-ui-componentes";
```

---

## Props

| Prop           | Tipo                      | Por defecto                  | Descripción                                                                                      |
| -------------- | ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `value`        | `object \| array \| null` | —                            | Valor controlado. Si se omite, el componente maneja su propio estado interno.                    |
| `onChange`     | `function`                | `() => {}`                   | Callback al cambiar la selección. Recibe `{ target: { name, value }, value }`.                   |
| `options`      | `array`                   | `[]`                         | Lista de opciones disponibles. Ver estructura de opción más abajo.                               |
| `placeholder`  | `string`                  | `'Seleccione una opción...'` | Texto mostrado cuando no hay valor seleccionado.                                                 |
| `variant`      | `string`                  | `'primary'`                  | Variante de color. Ver opciones en la sección **Variantes**.                                     |
| `size`         | `string`                  | `'medium'`                   | Tamaño del componente: `'small'`, `'medium'` o `'large'`.                                        |
| `multiSelect`  | `boolean`                 | `false`                      | Activa la selección múltiple. El `value` pasa a ser un array.                                    |
| `isClearable`  | `boolean`                 | `false`                      | Muestra un botón para limpiar la selección.                                                      |
| `disabled`     | `boolean`                 | `false`                      | Deshabilita el componente.                                                                       |
| `loading`      | `boolean`                 | `false`                      | Muestra un spinner en lugar del chevron.                                                         |
| `errorMessage` | `string`                  | `''`                         | Mensaje de error mostrado debajo del selector. Activa estilos de borde de error.                 |
| `label`        | `string`                  | `''`                         | Etiqueta visible sobre el selector.                                                              |
| `name`         | `string`                  | `''`                         | Nombre del campo, incluido en el evento `onChange` y `onBlur`.                                   |
| `fullWidth`    | `boolean`                 | `false`                      | Hace que el componente ocupe el 100% del ancho disponible.                                       |
| `defaultValue` | `object \| array \| null` | `null`                       | Valor inicial en modo no controlado.                                                             |
| `iconLeft`     | `ReactElement`            | —                            | Ícono opcional renderizado a la izquierda del selector (se clona con el `size` correspondiente). |
| `onBlur`       | `function`                | —                            | Callback ejecutado al cerrar el dropdown haciendo clic fuera.                                    |
| `className`    | `string`                  | `''`                         | Clases CSS adicionales aplicadas al contenedor externo.                                          |

---

## Estructura de una opción

```js
{
  value: 'cl',       // Identificador único (requerido)
  label: 'Chile',    // Texto mostrado en la lista (requerido)
  group: 'América'   // Agrupa opciones bajo un encabezado (opcional)
}
```

---

## Variantes

El prop `variant` controla el color del borde al tener foco y el fondo de la opción seleccionada.

| Valor        | Descripción                                   |
| ------------ | --------------------------------------------- |
| `primary`    | Color primario de la aplicación (por defecto) |
| `success`    | Verde / confirmación                          |
| `warning`    | Amarillo / advertencia                        |
| `error`      | Rojo / error                                  |

---

## Tamaños

| Valor    | Alto | Fuente      | Border radius |
| -------- | ---- | ----------- | ------------- |
| `small`  | 32px | `text-xs`   | `rounded-md`  |
| `medium` | 36px | `text-sm`   | `rounded-lg`  |
| `large`  | 40px | `text-base` | `rounded-lg`  |

---

## Ref

Se puede pasar un `ref` al componente para acceder a los siguientes métodos:

| Método       | Descripción                           |
| ------------ | ------------------------------------- |
| `focus()`    | Pone el foco en el selector.          |
| `getValue()` | Retorna el valor actual seleccionado. |

---

## Ejemplos

### Selección simple controlada

```jsx
const [pais, setPais] = useState(null)

const opciones = [
  { value: 'cl', label: 'Chile' },
  { value: 'ar', label: 'Argentina' },
  { value: 'pe', label: 'Perú' }
]

<Select
  label="País"
  options={opciones}
  value={pais}
  onChange={({ value }) => setPais(value)}
  placeholder="Selecciona un país"
  isClearable
/>
```

### Selección múltiple

```jsx
const [seleccionados, setSeleccionados] = useState([])

<Select
  label="Categorías"
  options={opciones}
  value={seleccionados}
  onChange={({ value }) => setSeleccionados(value)}
  multiSelect
  isClearable
/>
```

### Con agrupación de opciones

```jsx
const opciones = [
  { value: 'cl', label: 'Chile',     group: 'América del Sur' },
  { value: 'ar', label: 'Argentina', group: 'América del Sur' },
  { value: 'es', label: 'España',    group: 'Europa' },
  { value: 'fr', label: 'Francia',   group: 'Europa' }
]

<Select options={opciones} placeholder="Selecciona un país" />
```

### Con estado de error

```jsx
<Select
  options={opciones}
  value={valor}
  onChange={({ value }) => setValor(value)}
  errorMessage="Este campo es requerido"
/>
```

### Con ícono a la izquierda

```jsx
import { Globe } from "lucide-react";

<Select
  options={opciones}
  iconLeft={<Globe />}
  placeholder="Selecciona un país"
/>;
```

### Estado de carga

```jsx
<Select options={[]} loading={true} placeholder="Cargando opciones..." />
```

### No controlado con valor por defecto

```jsx
<Select
  options={opciones}
  defaultValue={{ value: "cl", label: "Chile" }}
  name="pais"
  onBlur={(e) => console.log("blur", e.target.value)}
/>
```

---

## Notas de implementación

- El dropdown se renderiza mediante `createPortal` en `document.body` para evitar problemas de `z-index` y `overflow: hidden` en contenedores ancestros.
- La posición del dropdown se recalcula al hacer scroll o resize mientras está abierto.
- En modo `multiSelect`, el valor siempre es un array; el selector muestra `N seleccionados` en lugar del label de la opción.
- En modo no controlado se usa `defaultValue` para el estado inicial; en modo controlado, `value` y `onChange` son responsabilidad del padre.

# Table

Componente de tabla de datos con paginación, ordenamiento y filtrado por columna. Soporta modo controlado y no controlado, columnas auto-generadas, columnas con render personalizado y un estado de carga superpuesto.

---

## Importación

```jsx
import { Table } from "react-ui-componentes";
```

---

## Props

| Prop                 | Tipo       | Por defecto                  | Descripción                                                                                                                 |
| -------------------- | ---------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `columns`            | `array`    | Auto-generado                | Definición de columnas. Si se omite, se generan a partir de las keys del primer objeto en `data`. Ver estructura más abajo. |
| `data`               | `array`    | `[]`                         | Array de objetos con los datos a mostrar.                                                                                   |
| `actions`            | `function` | `null`                       | Función `(row) => ReactNode` que renderiza la columna de acciones para cada fila.                                           |
| `onRowClick`         | `function` | `null`                       | Callback `(row) => void` al hacer clic en una fila. Activa cursor pointer y soporte de teclado (`Enter` / `Space`).         |
| `onSortChange`       | `function` | `null`                       | Callback `(columnKey) => void` para ordenamiento externo (cuando `enableSorting` es `false`).                               |
| `caption`            | `string`   | —                            | Título sticky sobre la tabla.                                                                                               |
| `tableClassName`     | `string`   | `''`                         | Clases CSS adicionales para el elemento `<table>`.                                                                          |
| `rowClassName`       | `string`   | `''`                         | Clases CSS adicionales para cada fila `<tr>`.                                                                               |
| `size`               | `string`   | `'md'`                       | Tamaño de celdas y controles: `'sm'`, `'md'` o `'lg'`.                                                                      |
| `variant`            | `string`   | `'primary'`                  | Variante de color para loader, íconos de orden y filtro activo. Ver sección **Variantes**.                                  |
| `boldHeaders`        | `boolean`  | `false`                      | Aplica `font-bold` a los encabezados de columna.                                                                            |
| `heightVh`           | `number`   | `50`                         | Alto máximo del contenedor de la tabla expresado en `vh`.                                                                   |
| `disablePagination`  | `boolean`  | `false`                      | Desactiva la paginación y muestra todos los datos.                                                                          |
| `defaultRowsPerPage` | `number`   | `10`                         | Filas por página iniciales en modo no controlado.                                                                           |
| `rowsPerPageOptions` | `array`    | `[10, 25, 50]`               | Opciones disponibles en el selector de filas por página.                                                                    |
| `enableSorting`      | `boolean`  | `false`                      | Activa el ordenamiento interno por columna (asc → desc → sin orden).                                                        |
| `enableFiltering`    | `boolean`  | `false`                      | Activa el filtro por columna en el encabezado.                                                                              |
| `loadingInfo`        | `boolean`  | `false`                      | Muestra un overlay de carga sobre la tabla.                                                                                 |
| `textLoading`        | `string`   | `''`                         | Texto mostrado bajo el spinner del overlay de carga.                                                                        |
| `titleNoData`        | `string`   | `'No hay datos disponibles'` | Título del estado vacío.                                                                                                    |
| `subTitleNoData`     | `string`   | `''`                         | Subtítulo del estado vacío.                                                                                                 |

### Props de paginación controlada

Cuando se proporcionan `currentPage` y `rowsPerPage`, el componente pasa a modo controlado y la paginación es responsabilidad del padre.

| Prop                  | Tipo       | Descripción                                                            |
| --------------------- | ---------- | ---------------------------------------------------------------------- |
| `currentPage`         | `number`   | Página activa actual.                                                  |
| `rowsPerPage`         | `number`   | Filas por página activas.                                              |
| `totalItems`          | `number`   | Total de registros (para calcular el rango mostrado).                  |
| `totalPages`          | `number`   | Total de páginas.                                                      |
| `onPageChange`        | `function` | Callback `(direction: 'prev' \| 'next') => void` al cambiar de página. |
| `onRowsPerPageChange` | `function` | Callback `(event) => void` al cambiar las filas por página.            |

---

## Estructura de columna

```js
{
  key: 'nombre',                      // Key del campo en el objeto de datos (requerido)
  header: 'Nombre',                   // Texto del encabezado (requerido)
  sortable: true,                     // Habilita el orden para esta columna (opcional)
  wrapText: false,                    // Permite que el texto haga wrap; por defecto trunca (opcional)
  maxWidth: '200px',                  // Ancho máximo de la celda (opcional)
  render: (value, row) => ReactNode,  // Render personalizado de la celda (opcional)
  renderHeader: (column) => ReactNode // Render personalizado del encabezado (opcional)
}
```

---

## Variantes

| Valor        | Descripción                     |
| ------------ | ------------------------------- |
| `primary`    | Color primario de la aplicación |
| `success`    | Verde / confirmación            |
| `error`      | Rojo / error                    |
| `warning`    | Amarillo / advertencia          |
| `ghost`      | Neutro / sin acento             |

---

## Tamaños

| Valor | Padding header | Padding celda | Fuente      | Ícono |
| ----- | -------------- | ------------- | ----------- | ----- |
| `sm`  | `px-3 py-4`    | `px-3 py-2`   | `text-xs`   | 12px  |
| `md`  | `px-6 py-4`    | `px-6 py-4`   | `text-sm`   | 16px  |
| `lg`  | `px-6 py-4`    | `px-6 py-5`   | `text-base` | 20px  |

---

## Ref

Se puede pasar un `ref` al componente para acceder al nodo raíz del contenedor.

```jsx
const tableRef = useRef(null)
<Table ref={tableRef} ... />
```

---

## Comportamiento interno

**Ordenamiento (`enableSorting`):** cicla entre `asc → desc → sin orden`. Detecta automáticamente si el valor de la columna es numérico o texto para aplicar la comparación correcta. Los nulos/undefined siempre van al final. Si `enableSorting` es `false` pero se provee `onSortChange`, el click en el encabezado delega el orden al padre.

**Filtrado (`enableFiltering`):** el ícono de lupa aparece al pasar el cursor sobre el encabezado. Al activarse reemplaza visualmente el header por un input de texto inline. Filtra por `String.includes` case-insensitive y reinicia a la página 1 al cambiar el valor.

**Paginación:** en modo no controlado se maneja internamente. En modo controlado (cuando se proveen `currentPage` y `rowsPerPage`), el componente no llama a `setInternalCurrentPage` y delega todos los cambios a `onPageChange` y `onRowsPerPageChange`. La posición de scroll se preserva al volver a la página 1, y se reinicia a 0 al cambiar de página o de filas por página.

**Columnas auto-generadas:** si `columns` no se provee, se generan a partir de las keys del primer objeto de `data`, formateando camelCase a texto legible (ej. `fechaCreacion` → `Fecha Creacion`).

**Filas clickeables:** cuando `onRowClick` está definido, cada `<tr>` recibe `role="button"`, `tabIndex=0` y soporte para `Enter`/`Space`. Los clicks en la columna de acciones no propagan al handler de fila.

---

## Ejemplos

### Tabla básica no controlada

```jsx
const columns = [
  { key: 'nombre', header: 'Nombre' },
  { key: 'rut', header: 'RUT' },
  { key: 'estado', header: 'Estado' }
]

const data = [
  { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9', estado: 'Activo' },
  { id: 2, nombre: 'Ana Gómez', rut: '9.876.543-2', estado: 'Inactivo' }
]

<Table columns={columns} data={data} />
```

### Con columna de render personalizado y acciones

```jsx
const columns = [
  { key: 'nombre', header: 'Nombre' },
  {
    key: 'estado',
    header: 'Estado',
    render: (value) => (
      <span className={value === 'Activo' ? 'text-green-600' : 'text-red-500'}>
        {value}
      </span>
    )
  }
]

<Table
  columns={columns}
  data={data}
  actions={(row) => (
    <button onClick={() => handleEdit(row)}>Editar</button>
  )}
/>
```

### Con ordenamiento y filtrado internos

```jsx
<Table
  columns={columns}
  data={data}
  enableSorting
  enableFiltering
  variant="primary"
/>
```

### Paginación controlada (datos del servidor)

```jsx
const [page, setPage] = useState(1)
const [perPage, setPerPage] = useState(10)
const { data, total, totalPages } = useFetchData(page, perPage)

<Table
  columns={columns}
  data={data}
  currentPage={page}
  rowsPerPage={perPage}
  totalItems={total}
  totalPages={totalPages}
  onPageChange={(dir) => setPage((p) => dir === 'next' ? p + 1 : p - 1)}
  onRowsPerPageChange={(e) => {
    setPerPage(Number(e.target.value))
    setPage(1)
  }}
/>
```

### Con overlay de carga

```jsx
<Table
  columns={columns}
  data={data}
  loadingInfo={isLoading}
  textLoading="Cargando registros..."
  variant="primary"
/>
```

### Estado vacío personalizado

```jsx
<Table
  columns={columns}
  data={[]}
  titleNoData="Sin resultados"
  subTitleNoData="Prueba con otros filtros o criterios de búsqueda."
/>
```

### Sin paginación (todos los datos visibles)

```jsx
<Table columns={columns} data={data} disablePagination heightVh={80} />
```

# Toaster

Sistema de notificaciones tipo toast. Compuesto por dos partes: el componente `<Toaster />` que se monta una sola vez en la app, y el objeto `toast` que se importa desde cualquier lugar para disparar notificaciones de forma imperativa.

---

## Importación

```jsx
import { Toaster, toast } from "react-ui-componentes";
```

---

## Configuración

Coloca `<Toaster />` una sola vez en el árbol de componentes, idealmente en el layout raíz. No necesita estar cerca del punto donde se disparan los toasts.

```jsx
// App.jsx o layout principal
import { Toaster } from "react-ui-componentes";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </>
  );
}
```

### Props de `<Toaster />`

| Prop       | Tipo     | Por defecto      | Descripción                                                                    |
| ---------- | -------- | ---------------- | ------------------------------------------------------------------------------ |
| `position` | `string` | `'bottom-right'` | Posición de los toasts en pantalla. Ver opciones en la sección **Posiciones**. |

---

## API imperativa — `toast`

### Métodos de conveniencia

```js
toast.success(title, subtitle?, duration?)
toast.error(title, subtitle?, duration?)
toast.info(title, subtitle?, duration?)
toast.warning(title, subtitle?, duration?)
```

### Método genérico

```js
toast.push(title, subtitle, variant, duration);
```

| Parámetro  | Tipo     | Por defecto | Descripción                                                         |
| ---------- | -------- | ----------- | ------------------------------------------------------------------- |
| `title`    | `string` | —           | Texto principal del toast (requerido).                              |
| `subtitle` | `string` | —           | Texto secundario opcional.                                          |
| `variant`  | `string` | `'info'`    | Tipo visual. Ver sección **Variantes**.                             |
| `duration` | `number` | `4000`      | Tiempo en ms antes de cerrarse automáticamente. `0` para no cerrar. |

Todos los métodos retornan el `id` numérico del toast creado.

### Cierre manual

```js
const id = toast.success("Guardado", "Los cambios fueron guardados.");
// ...más tarde:
toast.dismiss(id);
```

---

## Variantes

| Valor     | Ícono       | Color     |
| --------- | ----------- | --------- |
| `success` | ✓ checkmark | Esmeralda |
| `error`   | ✕ cruz      | Rojo      |
| `warning` | ⚠ triángulo | Ámbar     |
| `info`    | ⓘ círculo   | Azul      |

---

## Posiciones

| Valor           | Descripción                            |
| --------------- | -------------------------------------- |
| `top-left`      | Esquina superior izquierda             |
| `top-center`    | Centro superior                        |
| `top-right`     | Esquina superior derecha               |
| `bottom-left`   | Esquina inferior izquierda             |
| `bottom-center` | Centro inferior                        |
| `bottom-right`  | Esquina inferior derecha (por defecto) |

---

## Comportamiento

**Apilamiento:** se muestran hasta 5 toasts simultáneos. Los más nuevos aparecen encima. A medida que se apilan, los toasts inferiores se escalan, desvanecen y desenfogan levemente para crear profundidad visual.

**Animación:** entrada y salida con `cubic-bezier(0.23, 1, 0.32, 1)` de 450ms. Los toasts superiores entran desde arriba, los inferiores desde abajo.

**Auto-cierre:** pasado el `duration`, el toast inicia su animación de salida y luego se elimina del estado. Con `duration: 0` el toast persiste hasta ser cerrado manualmente por el usuario o con `toast.dismiss(id)`.

**Portal:** el contenedor se renderiza en `document.body` vía `createPortal`, evitando problemas de `z-index` o `overflow` en contenedores ancestros.

**Estado global:** `toastState` es un singleton de módulo. Los toasts son accesibles desde cualquier parte de la app sin contexto ni provider.

---

## Ejemplos

### Uso básico

```js
toast.success("Contrato guardado");
toast.error("No se pudo conectar", "Intenta nuevamente en unos minutos.");
toast.warning("Sesión por expirar", "Tu sesión expirará en 5 minutos.");
toast.info("Nuevo mensaje", "Tienes 3 mensajes sin leer.");
```

### Duración personalizada

```js
// Toast que dura 8 segundos
toast.success("Proceso completado", "Se procesaron 1.200 registros.", 8000);

// Toast persistente (no se cierra solo)
toast.info("Cargando reporte...", "", 0);
```

### Cerrar un toast programáticamente

```js
const id = toast.info("Subiendo archivo...", "Por favor espera.", 0);

await uploadFile(file);

toast.dismiss(id);
toast.success("Archivo subido", "El archivo fue cargado correctamente.");
```

### Con variante genérica

```js
toast.push("Título", "Descripción opcional", "warning", 5000);
```

# Toggle

Interruptor tipo switch para valores booleanos. Soporta variantes de color, posición de etiqueta, estados de error, solo lectura y deshabilitado. Compatible con formularios mediante `name` y `ref`.

---

## Importación

```jsx
import { Toggle } from "react-ui-componentes";
```

---

## Props

| Prop            | Tipo       | Por defecto | Descripción                                                                                              |
| --------------- | ---------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `checked`       | `boolean`  | —           | Estado del toggle (controlado).                                                                          |
| `onChange`      | `function` | —           | Callback `(event) => void` al cambiar el estado.                                                         |
| `label`         | `string`   | `''`        | Texto descriptivo junto al toggle.                                                                       |
| `labelPosition` | `string`   | `'right'`   | Posición de la etiqueta: `'right'` o `'left'`.                                                           |
| `variant`       | `string`   | `'primary'` | Color del track cuando está activo. Ver sección **Variantes**.                                           |
| `disabled`      | `boolean`  | `false`     | Deshabilita el toggle e impide la interacción.                                                           |
| `readOnly`      | `boolean`  | `false`     | Muestra el toggle sin permitir cambios. No bloquea el cursor del label salvo que también sea `disabled`. |
| `errorMessage`  | `string`   | `''`        | Mensaje de error mostrado debajo. Fuerza la variante `error` en el track y la etiqueta.                  |
| `name`          | `string`   | `''`        | Nombre del campo para formularios.                                                                       |
| `fullWidth`     | `boolean`  | `false`     | Hace que el contenedor ocupe el 100% del ancho disponible.                                               |
| `className`     | `string`   | `''`        | Clases CSS adicionales para el contenedor externo.                                                       |

---

## Variantes

La variante controla el color del track cuando el toggle está activo (`checked: true`).

| Valor        | Variable CSS         |
| ------------ | -------------------- |
| `primary`    | `--primary-focus`    |
| `success`    | `--success-focus`    |
| `error`      | `--error-focus`      |
| `warning`    | `--warning-focus`    |

> Cuando `errorMessage` tiene contenido, la variante activa se fuerza a `error` independientemente del valor del prop `variant`.

---

## Ref

Se puede pasar un `ref` al componente para acceder al `<input type="checkbox">` subyacente.

```jsx
const toggleRef = useRef(null)
<Toggle ref={toggleRef} checked={value} onChange={handleChange} />
```

---

## Accesibilidad

El input está oculto visualmente (`sr-only`) pero sigue siendo accesible para lectores de pantalla. Cuando hay un `errorMessage`, el input recibe `aria-invalid="true"` y `aria-describedby` apuntando al párrafo de error.

---

## Ejemplos

### Controlado básico

```jsx
const [activo, setActivo] = useState(false)

<Toggle
  label="Recibir notificaciones"
  checked={activo}
  onChange={(e) => setActivo(e.target.checked)}
/>
```

### Etiqueta a la izquierda

```jsx
<Toggle
  label="Modo oscuro"
  labelPosition="left"
  checked={darkMode}
  onChange={(e) => setDarkMode(e.target.checked)}
/>
```

### Con variante de color

```jsx
<Toggle
  label="Activo"
  variant="success"
  checked={checked}
  onChange={handleChange}
/>
```

### Con mensaje de error

```jsx
<Toggle
  label="Aceptar términos y condiciones"
  checked={aceptado}
  onChange={(e) => setAceptado(e.target.checked)}
  errorMessage={!aceptado ? "Debes aceptar los términos para continuar." : ""}
/>
```

### Deshabilitado y solo lectura

```jsx
// No se puede interactuar
<Toggle label="Función no disponible" checked={false} disabled />

// Se ve el estado pero no se puede cambiar
<Toggle label="Configurado por el sistema" checked={true} readOnly />
```

### En un formulario con name y ref

```jsx
const ref = useRef(null)

<Toggle
  ref={ref}
  name="terminos"
  label="Acepto los términos"
  checked={values.terminos}
  onChange={handleChange}
/>
```

# Tooltip

Componente de tooltip accesible con posicionamiento dinámico y soporte para múltiples variantes visuales. Se renderiza mediante un **portal** (`createPortal`) directamente en `document.body`, evitando problemas de desbordamiento (`overflow: hidden`) en contenedores padre.

---

## Props

| Prop        | Tipo        | Default   | Requerido | Descripción                                                              |
| ----------- | ----------- | --------- | --------- | ------------------------------------------------------------------------ |
| `children`  | `ReactNode` | —         | ✅        | Elemento disparador del tooltip (trigger).                               |
| `content`   | `ReactNode` | —         | ✅        | Contenido a mostrar dentro del tooltip.                                  |
| `position`  | `string`    | `'top'`   | ❌        | Posición preferida: `'top'`, `'bottom'`, `'left'`, `'right'`.            |
| `variant`   | `string`    | `'light'` | ❌        | Tema visual (ver [Variantes](#variantes)).                               |
| `delay`     | `number`    | `300`     | ❌        | Retardo en milisegundos antes de mostrar el tooltip al hacer hover.      |
| `nowrap`    | `boolean`   | `false`   | ❌        | Si es `true`, el contenido no hace salto de línea (`whitespace-nowrap`). |
| `className` | `string`    | `''`      | ❌        | Clases CSS adicionales para el elemento wrapper del trigger.             |

---

## Variantes

| Valor        | Descripción                                         |
| ------------ | --------------------------------------------------- |
| `light`      | Fondo blanco, texto oscuro, borde gris. _(default)_ |
| `dark`       | Fondo gris oscuro, texto blanco.                    |
| `primary`    | Usa la CSS variable `--primary-bg`.                 |
| `success`    | Usa la CSS variable `--success-bg`.                 |
| `error`      | Usa la CSS variable `--error-bg`.                   |
| `warning`    | Usa la CSS variable `--warning-bg`.                 |

---

## Ejemplos de uso

### Básico

```jsx
<Tooltip content="Texto de ayuda">
  <button>Hover me</button>
</Tooltip>
```

### Con posición y variante personalizadas

```jsx
<Tooltip content="Guardado correctamente" position="bottom" variant="success">
  <span>✔ Guardar</span>
</Tooltip>
```

### Con contenido JSX y sin salto de línea

```jsx
<Tooltip
  content={
    <span>
      Línea única <strong>sin wrap</strong>
    </span>
  }
  nowrap
  variant="dark"
>
  <InfoIcon />
</Tooltip>
```

### Con delay personalizado

```jsx
<Tooltip content="Aparece más rápido" delay={100}>
  <button>Hover</button>
</Tooltip>
```

---

## Comportamiento

### Posicionamiento dinámico

El componente calcula la posición del tooltip en tiempo de ejecución usando `getBoundingClientRect`. Antes de mostrarse, evalúa si la posición preferida cabe dentro del viewport con un margen de **10px**. Si no hay espacio suficiente, la invierte automáticamente:

| Posición preferida | Fallback |
| ------------------ | -------- |
| `top`              | `bottom` |
| `bottom`           | `top`    |
| `left`             | `right`  |
| `right`            | `left`   |

Adicionalmente, aplica un **clamp** sobre `top` y `left` para que el tooltip nunca desborde el viewport en ninguno de los ejes.

### Visibilidad diferida

Para evitar un _flash_ en la posición `[0, 0]`, el tooltip se monta en el DOM con `opacity: 0` y solo se vuelve visible (`opacity: 100`) una vez que el cálculo de posición ha sido completado (`isPositioned = true`).

### Portal

El tooltip se inyecta directamente en `document.body` mediante `createPortal`. Esto lo libera de cualquier restricción de `overflow: hidden`, `z-index` o `transform` de los contenedores padre.

### Accesibilidad

- El wrapper del trigger escucha `onFocus` y `onBlur`, por lo que el tooltip también funciona con navegación por teclado (Tab).
- El tooltip usa `role="tooltip"`.
- `aria-hidden` está activo mientras el tooltip aún no ha sido posicionado, evitando que los lectores de pantalla lo anuncien prematuramente.

---

## Estado interno

| Estado           | Tipo      | Descripción                                                                       |
| ---------------- | --------- | --------------------------------------------------------------------------------- |
| `isVisible`      | `boolean` | Controla si el tooltip está montado en el DOM.                                    |
| `isPositioned`   | `boolean` | Indica si el cálculo de posición ya fue aplicado. Activa la opacidad.             |
| `tooltipStyle`   | `object`  | Estilos `top` y `left` calculados para posicionar el tooltip (`position: fixed`). |
| `actualPosition` | `string`  | Posición real tras aplicar la lógica de colisión. Orienta la flecha.              |

---

## Dependencias

- `react` — `useState`, `useRef`, `useEffect`
- `react-dom` — `createPortal`
- Tailwind CSS con prefijo `rui:`
