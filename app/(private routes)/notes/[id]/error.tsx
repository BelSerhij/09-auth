'use client';

type Props = {
  error: Error;
};

export default function ErrorPage ({ error }: Props) {
  return (
    <div>
        <p>Could not fetch note details. {error.message}</p>    
    </div>
  );
}





