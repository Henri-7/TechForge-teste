type SectionTitleProps = {
  eyebrow: string
  title: string
  accent?: string
  description?: string
}

export function SectionTitle({ eyebrow, title, accent, description }: SectionTitleProps) {
  const parts = accent ? title.split(accent) : [title]

  return (
    <div className="section-title reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>
        {accent && parts.length > 1 ? (
          <>
            {parts[0]}
            <span>{accent}</span>
            {parts.slice(1).join(accent)}
          </>
        ) : (
          title
        )}
      </h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}
