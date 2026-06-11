export interface HelloWorldProps {
  name?: string;
  color?: string;
}

export const HelloWorld = ({ name = 'World', color = '#6366f1' }: HelloWorldProps) => {
  return (
    <div
      style={{
        padding: '16px 24px',
        border: `2px solid ${color}`,
        borderRadius: 8,
        fontFamily: 'sans-serif',
        display: 'inline-block',
      }}
    >
      <span style={{ color, fontWeight: 600 }}>@open-comp</span> says: Hello,{' '}
      <strong>{name}</strong>!
    </div>
  );
};

export default HelloWorld;
