
#ifndef LIBOBS_EXPORT_H
#define LIBOBS_EXPORT_H

#ifdef LIBOBS_STATIC_DEFINE
#  define LIBOBS_EXPORT
#  define LIBOBS_NO_EXPORT
#else
#  ifndef LIBOBS_EXPORT
#    ifdef libobs_EXPORTS
        /* We are building this library */
#      define LIBOBS_EXPORT __declspec(dllexport)
#    else
        /* We are using this library */
#      define LIBOBS_EXPORT __declspec(dllimport)
#    endif
#  endif

#  ifndef LIBOBS_NO_EXPORT
#    define LIBOBS_NO_EXPORT 
#  endif
#endif

#ifndef LIBOBS_DEPRECATED
#  define LIBOBS_DEPRECATED __declspec(deprecated)
#endif

#ifndef LIBOBS_DEPRECATED_EXPORT
#  define LIBOBS_DEPRECATED_EXPORT LIBOBS_EXPORT LIBOBS_DEPRECATED
#endif

#ifndef LIBOBS_DEPRECATED_NO_EXPORT
#  define LIBOBS_DEPRECATED_NO_EXPORT LIBOBS_NO_EXPORT LIBOBS_DEPRECATED
#endif

/* NOLINTNEXTLINE(readability-avoid-unconditional-preprocessor-if) */
#if 0 /* DEFINE_NO_DEPRECATED */
#  ifndef LIBOBS_NO_DEPRECATED
#    define LIBOBS_NO_DEPRECATED
#  endif
#endif

#endif /* LIBOBS_EXPORT_H */
