'use client';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  user?: {
    name: string | null;
  } | null;
}

interface ProductReviewsProps {
  reviews: Review[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Este produto ainda não possui avaliações.</p>
        <p className="text-sm text-gray-400 mt-1">Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
        <div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${star <= averageRating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">{reviews.length} avaliação{reviews.length !== 1 ? 'ções' : ''}</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-medium text-gray-900 text-sm">
                  {review.user?.name || 'Cliente'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {review.title && (
              <p className="mt-2 font-medium text-gray-900">{review.title}</p>
            )}
            {review.comment && (
              <p className="mt-1 text-gray-600">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}