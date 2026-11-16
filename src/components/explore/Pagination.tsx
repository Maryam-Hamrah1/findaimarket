import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageItem = number | 'start-ellipsis' | 'end-ellipsis'

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  let start = current - 1
  let end = current + 1

  if (current <= 3) {
    start = 2
    end = 4
  } else if (current >= total - 2) {
    start = total - 3
    end = total - 1
  }

  const items: PageItem[] = [1]

  if (start > 2) items.push('start-ellipsis')
  for (let index = start; index <= end; index += 1) items.push(index)
  if (end < total - 1) items.push('end-ellipsis')

  items.push(total)

  return items
}

const baseButton =
  'inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className={`${baseButton} gap-1 border-brand-border bg-surface text-foreground hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40`}
          >
            <ChevronLeft size={17} />
            <span className="hidden sm:inline">Previous</span>
          </button>
        </li>

        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={`${baseButton} ${
                  item === page
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-brand-border bg-surface text-foreground hover:border-accent hover:text-accent'
                }`}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className={`${baseButton} gap-1 border-brand-border bg-surface text-foreground hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={17} />
          </button>
        </li>
      </ul>
    </nav>
  )
}
