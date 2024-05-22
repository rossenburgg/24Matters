import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}



export function InstagramSansText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'InstagramSans' }]} />;
}

export function InstagramSansBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'InstagramSansBold' }]} />;
}

export function InstagramSansMedium(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'InstagramSansMedium' }]} />;
}

export function InstagramSansLight(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'InstagramSansLight' }]} />;
}


