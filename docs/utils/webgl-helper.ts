// 这是一个通用的 Shader 编译与链接工具
// 相当于你在 C++ 里写的一个 loadShader 函数

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("无法创建 Shader 对象");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // 错误检查（非常重要，否则 Shader 写错了没报错你会由于崩溃）
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader 编译错误:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error("Shader 编译失败");
  }
  return shader;
}

export function createProgram(gl: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

  const program = gl.createProgram();
  if (!program) throw new Error("无法创建 Program 对象");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program 链接错误:', gl.getProgramInfoLog(program));
    throw new Error("Program 链接失败");
  }
  
  return program;
}