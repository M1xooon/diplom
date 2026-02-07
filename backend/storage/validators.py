from rest_framework import serializers


def patchValidator(data):
    if 'id' not in data:
        raise serializers.ValidationError({
            'message': 'id parameter is lost',
        })

    if 'native_file_name' not in data:
        raise serializers.ValidationError({
            'message': 'native_file_name parameter is lost',
        })

    if 'comment' not in data:
        raise serializers.ValidationError({
            'message': 'comment parameter is lost',
        })

    return data
