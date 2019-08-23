export default /* glsl */`
uniform bool enableProjection;
varying vec3 vProjectionPosition;
varying vec3 vProjectionNormal;

vec4 GetTexelColorFromProjection( sampler2D _map, vec3 _projectionPosition, vec4 _offsetRepeat ) {

  // Triplanar projection, in future other types of projections can be added
  // calculate weight for each plane depending on surface normal for blending
  vec3 weightVec = abs( normalize( vProjectionNormal ) );
  weightVec.x = pow( weightVec.x, projectionSharpness );
  weightVec.y = pow( weightVec.y, projectionSharpness );
  weightVec.z = pow( weightVec.z, projectionSharpness );
  float weightSum = max( weightVec.x + weightVec.y + weightVec.z, 0.00001 );
  weightVec /= weightSum;

  // fetch color from texture for each plane
  vec4 mapXtexel = texture2D( _map, vec2( fract( abs( _projectionPosition.y ) * _offsetRepeat.z ), fract( abs( _projectionPosition.z ) * _offsetRepeat.w ) ) );
  vec4 mapYtexel = texture2D( _map, vec2( fract( abs( _projectionPosition.x ) * _offsetRepeat.z ), fract( abs( _projectionPosition.z ) * _offsetRepeat.w ) ) );
  vec4 mapZtexel = texture2D( _map, vec2( fract( abs( _projectionPosition.x ) * _offsetRepeat.z ), fract( abs( _projectionPosition.y ) * _offsetRepeat.w ) ) );

  // texel blending from all three planes
  return weightVec.x * mapXtexel + weightVec.y * mapYtexel + weightVec.z * mapZtexel;

}
`;
