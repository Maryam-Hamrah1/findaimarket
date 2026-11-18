import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../components/seller/ConfirmDialog'
import ImageListField from '../../components/seller/ImageListField'
import PageHeader from '../../components/seller/PageHeader'
import Panel from '../../components/seller/Panel'
import Button from '../../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../../components/ui/FormFields'
import { CATEGORIES } from '../../data/categories'
import { PRODUCTS } from '../../data/products'
import { nextProductId } from '../../data/catalog'
import { useLeaveGuard } from '../../hooks/useLeaveGuard'
import { useSellerProducts } from '../../hooks/useSellerData'
import { useSellerStore } from '../../hooks/useSellerStore'
import { productRegistry } from '../../services/productRegistry'
import type { ProductFormErrors, ProductFormValues, SellerProductRecord } from '../../types/seller'
import { slugify } from '../../utils/slug'
import {
  PRODUCT_LIMITS,
  emptyProductForm,
  formToFields,
  recordToForm,
  uniqueProductSlug,
  validateProductForm,
} from '../../utils/sellerProducts'

const ORDER: ReadonlyArray<keyof ProductFormValues> = [
  'name', 'shortDescription', 'description', 'category', 'price', 'oldPrice', 'stock', 'sku',
  'images', 'brand', 'weight', 'dimensions', 'sizes', 'colors', 'shipping',
]

function same(a: ProductFormValues, b: ProductFormValues): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function ProductForm({ existing }: { existing?: SellerProductRecord }) {
  const { store } = useSellerStore()
  const navigate = useNavigate()
  const initial = useMemo(() => (existing ? recordToForm(existing) : emptyProductForm()), [existing])
  const [values, setValues] = useState<ProductFormValues>(initial)
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const dirty = !same(values, initial)
  const guard = useLeaveGuard(dirty)
  const editing = existing !== undefined

  useEffect(() => {
    document.title = `${editing ? 'Edit product' : 'Add product'} · Seller dashboard · Findaimarket`
  }, [editing])

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => (previous[key] ? { ...previous, [key]: undefined } : previous))
    setSubmitError('')
  }

  const text = (key: Exclude<keyof ProductFormValues, 'images' | 'status'>) => ({
    id: `pf-${key}`,
    value: values[key],
    error: errors[key],
    onChange: (event: { target: { value: string } }) => set(key, event.target.value),
  })

  const handleSubmit = (event: { preventDefault(): void }) => {
    event.preventDefault()
    const found = validateProductForm(values)
    setErrors(found)
    setSubmitError('')

    const first = ORDER.find((key) => found[key])
    if (first) {
      window.setTimeout(() => document.getElementById(`pf-${first}`)?.focus(), 0)
      return
    }

    setSaving(true)
    const fields = formToFields(values)

    const result = existing
      ? productRegistry.update(store.id, existing.id, fields)
      : (() => {
          const taken = [...PRODUCTS.map((product) => slugify(product.name)), ...productRegistry.list().map((record) => record.slug)]
          const now = new Date().toISOString()
          return productRegistry.add({
            ...fields,
            id: nextProductId(),
            storeId: store.id,
            slug: uniqueProductSlug(fields.name, taken),
            createdAt: now,
            updatedAt: now,
          })
        })()

    setSaving(false)

    if (!result.ok) {
      setSubmitError(result.message)
      return
    }

    guard.allowNavigation()
    navigate('/seller/dashboard/products', {
      replace: true,
      state: {
        notice: `${result.record.name} was ${editing ? 'updated' : 'added'}${result.record.status === 'draft' ? ' as a Draft (hidden from shoppers).' : ' and is now visible in the shop.'}`,
      },
    })
  }

  return (
    <div className="fade-in">
      <PageHeader
        title={editing ? 'Edit product' : 'Add new product'}
        description="Active products appear in Explore, search and your store page. Drafts stay hidden."
        actions={<Link to="/seller/dashboard/products" className="inline-flex min-h-11 items-center rounded-full border border-brand-border px-5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent">Back to products</Link>}
      />
      <h2 ref={headingRef} tabIndex={-1} className="sr-only">{editing ? 'Edit product form' : 'New product form'}</h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Panel title="Basic information">
          <div className="grid gap-5">
            <TextField {...text('name')} label="Product name" required maxLength={PRODUCT_LIMITS.nameMax + 20} />
            <TextAreaField {...text('shortDescription')} label="Short description" required rows={2} maxCharacters={PRODUCT_LIMITS.shortMax} hint="Shown at the top of the product page." />
            <TextAreaField {...text('description')} label="Full description" rows={6} maxCharacters={PRODUCT_LIMITS.descriptionMax} />
            <SelectField {...text('category')} label="Category" required>
              <option value="">Choose a category</option>
              {CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </SelectField>
          </div>
        </Panel>

        <Panel title="Pricing and stock">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField {...text('price')} label="Price (USD)" required inputMode="decimal" placeholder="24.99" />
            <TextField {...text('oldPrice')} label="Original price (USD)" inputMode="decimal" placeholder="39.99" hint="Shown crossed out when it is higher than the price." />
            <TextField {...text('stock')} label="Stock quantity" required inputMode="numeric" placeholder="20" />
            <TextField {...text('sku')} label="SKU" hint="Your own code for this product." />
          </div>
        </Panel>

        <Panel title="Images">
          <ImageListField id="pf-images" value={values.images} error={errors.images} onChange={(images) => set('images', images)} />
        </Panel>

        <Panel title="Details and variations">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField {...text('brand')} label="Brand" />
            <TextField {...text('weight')} label="Weight" placeholder="450 g" />
            <TextField {...text('dimensions')} label="Dimensions" placeholder="30 × 20 × 10 cm" containerClassName="sm:col-span-2" />
            <TextField {...text('sizes')} label="Sizes" placeholder="S, M, L, XL" hint="Separate choices with commas. Leave empty if there are none." />
            <TextField {...text('colors')} label="Colors" placeholder="Black, Navy, Sand" hint="Separate choices with commas." />
          </div>
        </Panel>

        <Panel title="Shipping">
          <TextAreaField {...text('shipping')} label="Shipping information" rows={3} hint="Leave empty to use your store's shipping policy." />
        </Panel>

        <Panel title="Status">
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Product status</legend>
            {([
              { value: 'active', title: 'Active', text: 'Visible to shoppers in the shop.' },
              { value: 'draft', title: 'Draft', text: 'Saved, but hidden from shoppers.' },
            ] as const).map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors focus-within:outline-2 focus-within:outline-accent ${values.status === option.value ? 'border-accent bg-primary-light' : 'border-brand-border bg-background hover:border-accent'}`}
              >
                <input type="radio" name="status" value={option.value} checked={values.status === option.value} onChange={() => set('status', option.value)} className="sr-only" />
                <span className="block text-sm font-bold text-foreground">{option.title}</span>
                <span className="mt-1 block text-xs text-muted">{option.text}</span>
              </label>
            ))}
          </fieldset>
        </Panel>

        {submitError && <p role="alert" className="rounded-xl border border-danger px-4 py-3 text-sm text-danger">{submitError}</p>}

        <div className="flex flex-wrap justify-end gap-3">
          <Link to="/seller/dashboard/products" className="inline-flex min-h-12 items-center rounded-full border border-brand-border px-6 text-sm font-semibold text-foreground hover:border-accent hover:text-accent">Cancel</Link>
          <Button type="submit" variant="secondary" size="lg" disabled={saving} className="min-h-12">
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={guard.pending !== null}
        title="Leave without saving?"
        message="You have changes that are not saved. If you leave now they will be lost."
        confirmLabel="Keep editing"
        cancelLabel="Leave page"
        onConfirm={guard.stay}
        onCancel={guard.leave}
      />
    </div>
  )
}

export default function ProductFormPage() {
  const { productId } = useParams()
  const { store } = useSellerStore()
  const products = useSellerProducts(store.id)

  if (productId === undefined) return <ProductForm />

  // Only this store's products are searched, so another seller's product can never be opened here
  const existing = products.find((product) => String(product.id) === productId)
  if (!existing) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-3xl font-medium text-foreground">Product not found</h1>
        <p className="mt-2 text-sm text-muted">It may have been deleted, or it is not part of your store.</p>
        <Link to="/seller/dashboard/products" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover">Back to products</Link>
      </div>
    )
  }

  // Keyed so the form starts fresh for each product
  return <ProductForm key={existing.id} existing={existing} />
}
